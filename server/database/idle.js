import db from "./connection.js";
import { skillCheck } from "./skill.js";
import { deductResource } from "./resource.js";

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

    const client = await db.connect();
    try {
        await client.query(userIdlesSql, [userId]);
        await client.query(userResourcesSql, [userId]);
        await client.query(userExperiencesSql, [userId]);
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
}

export async function startIdle(userId, idleId) {
    const checkActiveForSkillSql = `
        SELECT 1
        FROM user_idles ui
        JOIN idles i ON ui.idle_id = i.id
        WHERE ui.active = TRUE
        AND i.skill_id = (SELECT skill_id FROM idles WHERE id = $2)
        AND ui.user_id = $1
        LIMIT 1
    `;

    const sql = `UPDATE user_idles SET started = NOW(), active = TRUE 
        WHERE user_id = $1
        AND idle_id = $2
        AND active = FALSE 
        RETURNING active, EXTRACT(EPOCH FROM started) AS started_unix`;
    const values = [userId, idleId];
    const client = await db.connect();
    try {
        const checkActiveRes = await client.query(
            checkActiveForSkillSql,
            values
        );
        if (checkActiveRes.rows.length > 0) {
            throw new Error("You can only have one active idle per skill");
        }
        const res = await client.query(sql, values);
        await client.query("COMMIT");
        return res;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
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
            AND ue.skill_id = (SELECT skill_id FROM idles WHERE id = $2)
            AND sl.experience_required <= ue.experience
            ORDER BY sl.level DESC
            LIMIT 1
        ),
        item_bonus AS (
            SELECT i.bonus AS bonus, i.skill_id AS skill_id
            FROM items i
            JOIN user_items ui ON ui.item_id = i.id
            WHERE ui.user_id = $1
            AND i.skill_id = (SELECT skill_id FROM idles WHERE id = $2)
            AND ui.equipped IS TRUE
        ),
        factors AS (
            SELECT
                GREATEST(FLOOR((il.speed_seconds * POWER(0.98, usl.skill_level))), 2) AS speed,
                i.resource_id,
                i.skill_id,
                COALESCE(ib.bonus, 0) AS bonus
            FROM idle_levels il
            JOIN idles i ON i.id = $2
            JOIN user_skill_level usl ON TRUE
            LEFT JOIN item_bonus ib ON ib.skill_id = i.skill_id
            WHERE il.idle_id = $2
            AND il.level = (SELECT idle_level FROM locked)
        ),
        calculations AS (
            SELECT
                l.started,
                f.speed,
                f.skill_id AS skill_id,
                f.resource_id AS resource_id,
                f.bonus + 1 AS bonus, 
                EXTRACT(EPOCH FROM l.started) AS started_unix,
                ct.now_unix,
                ct.elapsed_seconds,
                CASE 
                    WHEN ct.elapsed_seconds < f.speed THEN
                        CASE WHEN ct.elapsed_seconds >= (f.speed - 1.1) THEN 1 ELSE 0 END
                    ELSE
                        FLOOR(ct.elapsed_seconds / f.speed) + 
                        CASE 
                            WHEN (ct.elapsed_seconds % f.speed) >= (f.speed - 1.1) THEN 1 
                            ELSE 0 
                        END
                END AS increment
            FROM locked l
            CROSS JOIN factors f 
            CROSS JOIN (
                    SELECT 
                        EXTRACT(EPOCH FROM NOW()) AS now_unix,
                        EXTRACT(EPOCH FROM (NOW() - l.started)) AS elapsed_seconds
                    FROM locked l
                ) AS ct
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
        CROSS JOIN calculations c;
    `;

        const res = await client.query(sql, [userId, idleId]);
        await client.query("COMMIT");
        return res.rows[0];
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}

export async function getIdle(userId, idleId) {
    const sql = `
    SELECT EXTRACT(EPOCH FROM started) * 1000 AS started_unix,
            ur.amount                    AS resource_amount,
            ur.id                        AS resource_id,
            l.speed_seconds             AS speed,
            ui.level                     AS level,
            EXTRACT(EPOCH FROM NOW()) * 1000 as server_now,
            (EXTRACT(EPOCH FROM NOW()) * 1000) - (EXTRACT(EPOCH FROM started) * 1000) AS diff
        FROM user_idles ui
            JOIN user_resources ur
                ON ur.user_id = ui.user_id
                    AND ur.resource_id = (SELECT i.resource_id FROM idles i WHERE ui.idle_id = i.id )
            JOIN idle_levels l
                ON l.idle_id = ui.idle_id
                    AND l.level = ui.level
        WHERE ui.user_id = $1
        AND ui.idle_id = $2
       `;
    const values = [userId, idleId];
    const client = await db.connect();
    try {
        const res = await client.query(sql, values);
        if (res.rows.length < 0) {
            throw Error("No idle found");
        }
        return res.rows[0];
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
}

export async function updateIdles(userId) {
    const client = await db.connect();
    try {
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
                COALESCE(ib.bonus, 0) AS bonus,
                i.skill_id
            FROM idle_levels il
            JOIN idles i ON i.id = il.idle_id
            JOIN locked l ON l.idle_id = i.id AND l.idle_level = il.level
            JOIN user_skill_level usl ON usl.skill_id = i.skill_id
            LEFT JOIN item_bonus ib ON ib.skill_id = i.skill_id
        ), 
        calculations AS (
            SELECT
                l.started,
                f.speed,
                f.skill_id,
                f.bonus + 1 AS bonus,
                l.idle_id As idle_id,
                f.resource_id AS resource_id,
                CASE 
                    WHEN EXTRACT(EPOCH FROM (NOW() - l.started)) < f.speed THEN
                        CASE WHEN EXTRACT(EPOCH FROM (NOW() - l.started)) >= (f.speed - 1.1) THEN 1 ELSE 0 END
                    ELSE
                        FLOOR(EXTRACT(EPOCH FROM (NOW() - l.started)) / f.speed) + 
                        CASE 
                            WHEN (EXTRACT(EPOCH FROM (NOW() - l.started)) % f.speed) >= (f.speed - 1.1) THEN 1 
                            ELSE 0 
                        END
                END AS increment,
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
        return res.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
    } finally {
        client.release();
    }
}

export async function unlockIdle(userId, idleId) {
    const getInfoSql = `
    SELECT 
        il.price, 
        il.level_requirement AS skill_req,
        il.resource_id,
        i.skill_id
    FROM idles i
    JOIN idle_levels il ON il.idle_id = i.id
    WHERE i.id = $1
    AND il.level = 1
    `;
    const unlockSql = `
    UPDATE user_idles
    SET unlocked = TRUE
    WHERE user_id = $1
    AND idle_id = $2
    `;

    const values = [userId, idleId];
    const client = await db.connect();
    try {
        await client.query("BEGIN");
        const info = await client.query(getInfoSql, [idleId]);
        const { price, skill_req, skill_id, resource_id } = info.rows[0];

        await skillCheck(userId, skill_id, skill_req);
        await deductResource(userId, resource_id, price);
        await client.query(unlockSql, values);

        await client.query("COMMIT");
        return { price };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export async function buyUpgrade(userId, upgradeId) {
    const checkLevelReq = `
        SELECT 
            ui.level AS user_level, 
            il.level AS idle_level,
            il.level_requirement AS skill_req,
            il.price,
            ui.idle_id,
            i.skill_id,
            il.id AS id
        FROM user_idles ui
        JOIN idle_levels il ON il.idle_id = ui.idle_id
        JOIN idles i ON i.id = ui.idle_id
        AND il.id = $2
        AND ui.user_id = $1
    `;
    const buyUpgradeSql = `
        UPDATE user_idles ui
        SET level = ui.level +1
        WHERE user_id = $1
        AND idle_id = $2
    `;

    const values = [userId, upgradeId];
    const client = await db.connect();
    try {
        await client.query("BEGIN");

        const info = await client.query(checkLevelReq, values);

        const { user_level, idle_level, skill_req, skill_id, price, idle_id } =
            info.rows[0];
        if (user_level + 1 !== idle_level) {
            throw Error("You need the previous upgrade!");
        }

        await skillCheck(userId, skill_id, skill_req);
        await deductResource(userId, 1, price);
        await client.query(buyUpgradeSql, [userId, idle_id]);
        await client.query("COMMIT");

        return { price, idleId: idle_id };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}
