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
            ON CONFLICT (user_id, resource_id) DO NOTHING;
    `;

    console.log("init idle for user");
    try {
        await db.query(userIdlesSql, [userId]);
        await db.query(userResourcesSql, [userId]);
        await db.query(userExperiencesSql, [userId]);
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
            SELECT started
            FROM user_idles
            WHERE user_id = $1 
            AND idle_id = $2
            AND active = TRUE
            FOR UPDATE
        ),
        updated_resources AS (
            UPDATE user_resources
            SET amount = amount + COALESCE(FLOOR(EXTRACT(EPOCH FROM (NOW() - (SELECT started FROM locked))) / 2), 0)
            WHERE user_id = $1
            AND resource_id = (SELECT resource_id FROM idles WHERE id = $2)
            RETURNING amount, resource_id
        ),
        set_inactive AS (
            UPDATE user_idles
            SET active = FALSE
            WHERE user_id = $1
            AND idle_id = $2
        )
        SELECT
            (SELECT amount FROM updated_resources) AS resource_amount,
            COALESCE(FLOOR(EXTRACT(EPOCH FROM (NOW() - (SELECT started FROM locked))) / 2), 0) AS increment,
            EXTRACT(EPOCH FROM (SELECT started FROM locked)) AS started_unix,
            EXTRACT(EPOCH FROM NOW()) AS now_unix,
            (SELECT resource_id FROM updated_resources)
        `;

        const { rows } = await client.query(sql, [userId, idleId]);
        await client.query("COMMIT");
        console.log("STOP IDLE DATA: ", rows[0]);
        return rows[0];
    } catch (err) {
        console.log("ROLLBACK?");
        await client.query("ROLLBACK");
        throw err;
    } finally {
        console.log("finally");
        client.release();
    }
}

export async function getIdle(userId, idleId) {
    const sql = `
    SELECT 
        EXTRACT(EPOCH FROM started) AS started_unix,
        r.amount AS resource_amount,
        r.id AS resource_id
    FROM user_idles i
    JOIN user_resources r 
        ON r.user_id = i.user_id 
        AND r.id = (SELECT resource_id FROM idles WHERE i.id = id)
    WHERE i.user_id = $1
    AND i.idle_id = $2`;
    const values = [userId, idleId];

    const res = await db.query(sql, values);
    // console.log("getIdle res:", res);
    return res.rows[0];
}

export async function updateIdle(userId, idleId) {
    const client = await db.connect();
    await client.query("BEGIN");
    const sql = `WITH old AS (
                    SELECT started 
                        FROM user_idles 
                    WHERE user_id = $1 
                        AND idle_id = $2
                        AND active = TRUE 
                    FOR UPDATE
                ),
                updated AS (
                    UPDATE user_idles 
                    SET started = NOW()
                    WHERE user_id = $1 
                    AND idle_id = $2
                    AND active = TRUE
                    RETURNING started
                ),
                update_resources AS (
                    UPDATE user_resources
                    SET amount = amount + COALESCE(FLOOR(EXTRACT(EPOCH FROM (NOW() - (SELECT started FROM old))) / 2), 0)
                    WHERE user_id = $1
                    AND resource_id = (SELECT resource_id FROM idles WHERE id = $2)
                    RETURNING amount
                )
                SELECT
                    (SELECT started FROM old) as old_started,
                    EXTRACT(EPOCH FROM (SELECT started FROM updated)) AS new_started,
                    (SELECT amount FROM update_resources ) as new_amount;
                `;

    const values = [userId, idleId];

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
