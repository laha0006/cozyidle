import db from "./connection.js";

export async function initIdleForUser(userId) {
    const userIdlesSql = `
            INSERT INTO user_idles (user_id, idle_id)
            SELECT $1, id FROM idles
            ON CONFLICT (user_id, idle_id) DO NOTHING;
    `;
    const userResourcesSql = `
            INSERT INTO user_resources (user_id, resource_id)
            SELECT $1, id FROM resources
            ON CONFLICT (user_id, idle_id)
    `;

    const client = await db.connect();
    try {
        await client.query("BEGIN");
        await client.query(userIdlesSql, userId);
        await client.query(userResourcesSql, userId);
        await client.query("COMMIT");
    } catch (err) {
        console.log(err);
        await db.query("ROLLBACK");
    } finally {
        client.release();
    }
}

export async function startIdle(userId, idleId) {
    const sql = `UPDATE user_idles SET started = NOW(), active = TRUE 
        WHERE user_id = $1
        AND idle_id = $2
        AND active = FALSE 
        RETURNING active, EXTRACT(EPOCH FROM started) AS started_unix`;
    const values = [userId, idleId];

    const res = await db.query(sql, values);
    return res;
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
            AND idle_id = $2
            RETURNING amount
        ),
        set_inactive AS (
            UPDATE user_idles
            SET active = FALSE
            WHERE user_id = $1
            AND idleid = $2
        )
        SELECT
            (SELECT count FROM updated_resources) AS resource_count,
            COALESCE(FLOOR(EXTRACT(EPOCH FROM (NOW() - (SELECT started FROM locked))) / 2), 0) AS increment,
            EXTRACT(EPOCH FROM (SELECT started FROM locked)) AS started_unix,
            EXTRACT(EPOCH FROM NOW()) AS now_unix
        `;

        const { rows } = await client.query(sql, [userId]);
        await client.query("COMMIT");
        console.log("STOP IDLE DATA: ", rows[0]);
        return rows[0];
    } catch (err) {
        console.log("ROLLBACK?");
        await client.query("ROLLBACK");
        throw err;
    } finally {
        console.log("finally");
        stopCalls--;
        client.release();
    }
}

export async function getIdle(userId, idleId) {
    const sql = `
    SELECT 
        EXTRACT(EPOCH FROM started) AS started_unix,
        r.amount AS resource_amount
    FROM user_idles i
    JOIN user_resources r ON r.user_id = i.user_id AND r.resource_id = i.resource_id
    WHERE i.user_id = $1
    AND i.idle_id = $2`;
    const values = [userId, idleId];

    const res = await db.query(sql, values);
    return res.rows[0];
}

export async function updateIdle(userId) {
    const client = await db.connect();
    await client.query("BEGIN");
    const sql = `WITH old AS (
                    SELECT started FROM user_idles WHERE user_id = $1 AND active = TRUE FOR UPDATE
                ),
                updated AS (
                    UPDATE user_idles 
                    SET started = NOW()
                    WHERE user_id = $1 AND active = TRUE
                    RETURNING started
                ),
                update_resources AS (
                    UPDATE user_resources
                    SET count = count + COALESCE(FLOOR(EXTRACT(EPOCH FROM (NOW() - (SELECT started FROM old))) / 2), 0)
                    WHERE user_id = $1
                    RETURNING count
                )
                SELECT
                    (SELECT started FROM old) as old_started,
                    EXTRACT(EPOCH FROM (SELECT started FROM updated)) AS new_started,
                    (SELECT count FROM update_resources ) as new_count;
                `;

    const values = [userId];

    const res = await client.query(sql, values);
    await client.query("COMMIT");
    client.release();
    return res.rows[0];
}

export async function deductResource(userId, resourceId, amount) {
    const sql = `
    UPDATE user_resources
    SET count = count - $3
    WHERE user_id = $1
        AND resource_id = $2
        AND amount >= $3 
    RETURNING count as resource_count
    `;

    const values = [userId, resourceId, amount];

    const res = await db.query(sql, values);
    return res.rows[0];
}
