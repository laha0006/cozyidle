import db from "./connection.js";

export async function initIdleForUser(userId) {
    const userIdlesSql = `
            INSERT INTO user_idles (user_id, idle_id, unlocked)
            SELECT $1, i.id, CASE WHEN il.level_requirement = 0 THEN TRUE ELSE FALSE END 
            FROM idles i, idle_levels il
            WHERE i.id = il.id 
            ON CONFLICT (user_id, idle_id) DO NOTHING;
    `;
    const userResourcesSql = `
            INSERT INTO user_resources (user_id, resource_id)
            SELECT $1, id FROM resources
            ON CONFLICT (user_id, resource_id) DO NOTHING;
    `;
    const userExperiencesSql = ` 
            INSERT INTO user_experiences (user_id, skill_id)
            SELECT $1, id FROM skills
            ON CONFLICT (user_id, skill_id) DO NOTHING;
    `;

    console.log("init idle for user");
    try {
        await db.query(userIdlesSql, [userId]);
        await db.query(userResourcesSql, [userId]);
        console.log("user experiences start");
        await db.query(userExperiencesSql, [userId]);
        console.log("user experiences end");
    } catch (err) {
        console.log(err);
    }
}

export async function startIdle(userId, idleId) {
    const sql = `UPDATE user_idles SET started = NOW(), active = TRUE 
        WHERE user_id = $1
        AND idle_id = $2
        AND active = FALSE 
        RETURNING active, EXTRACT(EPOCH FROM started) AS started_unix`;
    const values = [userId, idleId];
    try {
        const res = await db.query(sql, values);
        return res;
    } catch (error) {
        console.log(error);
    }
}

export async function stopIdle(userId, idleId) {
    const client = await db.connect();
    try {
        await client.query("BEGIN");

        const sql = `
        WITH locked AS (
            SELECT started, level AS idle_level 
            FROM user_idles
            WHERE user_id = $1 
            AND idle_id = $2
            AND active = TRUE
            FOR UPDATE
        ),
        user_skill_level AS (
            SELECT sl.level AS skill_level
            FROM user_experiences ue
            JOIN skill_levels sl ON sl.skill_id = ue.skill_id
            WHERE ue.user_id = $1
            AND ue.skill_id = $2
            AND sl.experience_required <= ue.experience
            ORDER BY sl.level DESC
            LIMIT 1
        ),
        item_bonus AS (
            SELECT i.bonus AS bonus, i.skill_id AS skill_id
            FROM items i
            JOIN user_items ui ON ui.item_id = i.id
            WHERE user_id = $1
            AND ui.equipped IS TRUE
        ),
        factors AS (
            SELECT 
                GREATEST(FLOOR((il.speed_seconds * POWER(0.98, usl.skill_level))), 2) AS speed, 
                i.resource_id
            FROM idle_levels il
            JOIN idles i ON i.id = $2
            JOIN user_skill_level usl ON TRUE
            JOIN item_bonus ib ON ib.skill_id = i.skill_id
            WHERE il.idle_id = $2
            AND il.level = (SELECT level FROM locked)
        ),
        calculations AS (
            SELECT 
                l.started,
                f.speed,
                ib.skill_id AS skill_id,
                f.resource_id AS resource_id,
                ib.bonus + 1 AS bonus,
                GREATEST(COALESCE(FLOOR(EXTRACT(EPOCH FROM (NOW() - l.started)) / f.speed), 0), 0) AS increment,
                EXTRACT(EPOCH FROM l.started) AS started_unix,
                EXTRACT(EPOCH FROM NOW()) AS now_unix
            FROM locked l
            CROSS JOIN factors f
            CROSS JOIN item_bonus ib
        ),
        updated_resources AS (
            UPDATE user_resources ur
            SET amount = ur.amount + (c.increment * c.bonus) 
            FROM calculations c
            WHERE user_id = $1
            AND ur.resource_id = c.resource_Id
            RETURNING ur.amount, ur.resource_id
        ),
        update_experiences AS (
            UPDATE user_experiences ue
            SET experience = experience + (c.increment * c.bonus )
            FROM calculations c
            WHERE user_id = $1
            AND ue.skill_id = c.skill_id
        ),
        set_inactive AS (
            UPDATE user_idles
            SET active = FALSE
            WHERE user_id = $1
            AND idle_id = $2
        )
        SELECT
            ur.amount AS resource_amount,
            c.increment,
            c.started_unix,
            c.now_unix,
            ur.resource_id
        FROM updated_resources ur
        CROSS JOIN calculations c;`;

        const { rows } = await client.query(sql, [userId, idleId]);
        await client.query("COMMIT");
        // console.log("STOP IDLE DATA: ", rows[0]);
        return rows[0];
    } catch (err) {
        console.log("ROLLBACK?");
        await client.query("ROLLBACK");
        throw err;
    } finally {
        // console.log("finally");
        client.release();
    }
}

export async function getIdle(userId, idleId) {
    const sql = `
        SELECT EXTRACT(EPOCH FROM started) * 1000 AS started_unix,
            r.amount                    AS resource_amount,
            r.id                        AS resource_id,
            l.speed_seconds             AS speed,
            i.level                     AS level
        FROM user_idles i
            JOIN user_resources r
                ON r.user_id = i.user_id
                    AND r.id = (SELECT resource_id FROM idles WHERE i.id = id)
            JOIN idle_levels l
                ON l.idle_id = i.idle_id
                    AND l.level = i.level
        WHERE i.user_id = $1
        AND i.idle_id = $2`;
    const values = [userId, idleId];

    const res = await db.query(sql, values);
    // console.log("getIdle res:", res);
    return res.rows[0];
}

export async function updateIdles(userId) {
    const client = await db.connect();
    await client.query("BEGIN");
    const sql = `
        WITH locked AS (
            SELECT ui.started AS started,
                   ui.active AS  active,
                   i.resource_id AS resource_id,
                   ui.level AS idle_level,
                   ui.idle_id as idle_id
            FROM user_idles ui
            JOIN idles i ON i.id = ui.idle_id
            WHERE user_id = $1
            AND active = TRUE
            FOR UPDATE
        ),
        user_skill_level AS (
           SELECT DISTINCT ON (sl.skill_id)
            sl.level AS skill_level,
                sl.skill_id AS skill_id
            FROM user_experiences ue
            JOIN skill_levels sl
            ON sl.skill_id = ue.skill_id
            WHERE ue.user_id = $1
            AND sl.experience_required <= ue.experience
            ORDER BY sl.skill_id ,sl.level DESC
        ),
        item_bonus AS (
            SELECT i.bonus AS bonus, i.skill_id AS skill_id
            FROM items i
            JOIN user_items ui ON ui.item_id = i.id
            WHERE user_id = $1
            AND ui.equipped IS TRUE
        ),
        factors AS (
            SELECT
                GREATEST(FLOOR((il.speed_seconds * POWER(0.98, usl.skill_level))), 2) AS speed,
                i.resource_id,
                l.idle_id,
                ib.bonus AS bonus,
                i.skill_id
            FROM idle_levels il
            JOIN idles i ON i.id = il.idle_id
            JOIN locked l ON l.idle_id = i.id AND l.idle_level = il.level
            JOIN user_skill_level usl ON usl.skill_id = i.skill_id
            JOIN item_bonus ib ON ib.skill_id = i.skill_id
        ), 
        calculations AS (
            SELECT
                l.started,
                f.speed,
                f.skill_id,
                f.bonus + 1 AS bonus,
                l.idle_id As idle_id,
                f.resource_id AS resource_id,
                GREATEST(COALESCE(FLOOR(EXTRACT(EPOCH FROM (NOW() - l.started)) / f.speed), 0), 0) AS increment,
                EXTRACT(EPOCH FROM l.started) AS started_unix,
                EXTRACT(EPOCH FROM NOW()) AS now_unix
            FROM locked l
            JOIN factors f ON f.idle_id = l.idle_id
        ),
        update_started AS (
            UPDATE user_idles ui
            SET started = ui.started + (c.increment * c.speed || ' seconds')::interval 
            FROM calculations c
            WHERE ui.user_id = 1
            AND ui.idle_id = c.idle_id
            AND ui.active = TRUE
            AND c.increment > 0
        ),
        updated_resources AS (
            UPDATE user_resources ur
            SET amount = amount + (c.increment * c.bonus)
            FROM calculations c
            WHERE user_id = $1
            AND ur.resource_id = c.resource_id
            RETURNING ur.amount, ur.resource_id, c.idle_id
        ),
        update_experiences AS (
            UPDATE user_experiences ue
            SET experience = ue.experience + (c.increment * c.bonus)
            FROM calculations c
            WHERE user_id = $1
            AND ue.skill_id = c.skill_id
        )
        SELECT
            ur.amount AS resource_amount,
            c.increment,
            c.started_unix,
            c.now_unix,
            ur.resource_id
        FROM updated_resources ur
        LEFT JOIN calculations c ON c.idle_id = ur.idle_id`;

    const values = [userId];

    const res = await client.query(sql, values);
    await client.query("COMMIT");
    client.release();
    return res.rows[0];
}

export async function deductResource(userId, resourceId, amount) {
    const sql = `
    UPDATE user_resources
    SET amount = amount - $3
    WHERE user_id = $1
        AND resource_id = $2
        AND amount >= $3 
    RETURNING amount as resource_amount
    `;

    const values = [userId, resourceId, amount];
    try {
        const res = await db.query(sql, values);
        return res.rows[0];
    } catch (error) {
        console.log(error);
    }
}

export async function equipItem(userId, itemId) {
    const checkEquippedSql = `
        SELECT ui.equipped 
        FROM user_items ui
        JOIN items i ON i.id = ui.item_id
        WHERE user_id = $1
        AND i.skill_id = (SELECT skill_id FROM items i WHERE i.id = $2)`;
    const equipItemSql = `
        UPDATE user_items ui
        SET equipped = TRUE
        WHERE user_id = $1
        AND ui.item_id = $2
    `;

    const client = await db.connect();
    const values = [userId, itemId];
    try {
        client.query("BEGIN");
        const res = await client.query(checkEquippedSql, values);
        console.log("check rows:", res.rows);
        if (res.rows.length > 0 && res.rows[0].equipped) {
            throw new Error("Item for this skill is already equipped");
        }
        const equipRes = await client.query(equipItemSql, values);
        client.query("COMMIT");
        return equipRes;
    } catch (error) {
        client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}
