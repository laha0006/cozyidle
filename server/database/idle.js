import db from "./connection.js";

let stopCalls = 0;
let startCalls = 0;

export async function startIdle(userId) {
    startCalls++;
    console.log("start idle");
    console.log("startCalls:", startCalls);
    console.log("stopCalls:", stopCalls);
    const sql = `UPDATE user_idles SET started = NOW(), active = TRUE 
        WHERE user_id = $1 
        AND active = FALSE 
        RETURNING active, EXTRACT(EPOCH FROM started) AS started_unix`;
    const values = [userId];

    const res = await db.query(sql, values);
    console.log("start:", res.rows[0]);
    startCalls--;
    return res;
}

export async function stopIdle(userId) {
    console.log("stop idle");
    stopCalls++;
    console.log("Stop calls:", stopCalls);
    console.log("start calss:", startCalls);
    const client = await db.connect();
    try {
        await client.query("BEGIN");

        const sql = `
    WITH locked AS (
        SELECT started
        FROM user_idles
        WHERE user_id = $1 AND active = TRUE
        FOR UPDATE
    ),
    updated_resources AS (
        UPDATE user_resources
        SET count = count + COALESCE(FLOOR(EXTRACT(EPOCH FROM (NOW() - (SELECT started FROM locked))) / 2), 0)
        WHERE user_id = $1
        RETURNING count
    ),
    set_inactive AS (
        UPDATE user_idles
        SET active = FALSE
        WHERE user_id = $1
    )
    SELECT
        (SELECT count FROM updated_resources) AS new_count,
        COALESCE(FLOOR(EXTRACT(EPOCH FROM (NOW() - (SELECT started FROM locked))) / 2), 0) AS increment,
        EXTRACT(EPOCH FROM (SELECT started FROM locked)) AS started_unix,
        EXTRACT(EPOCH FROM NOW()) AS now_unix
`;

        // const sql = `
        //     WITH locked AS (
        //         SELECT started
        //         FROM user_idles
        //         WHERE user_id = $1 AND active = TRUE
        //         FOR UPDATE
        //     ),
        //     updated_resources AS (
        //         UPDATE user_resources
        //         SET count = count + COALESCE(FLOOR(EXTRACT(EPOCH FROM (NOW() - (SELECT started FROM locked))) / 2), 0)
        //         WHERE user_id = $1
        //         RETURNING count
        //     ),
        //     set_inactive AS (
        //         UPDATE user_idles
        //         SET active = FALSE
        //         WHERE user_id = $1
        //     )
        //     SELECT
        //         (SELECT count FROM updated_resources) AS new_count,
        //         COALESCE(FLOOR(EXTRACT(EPOCH FROM (NOW() - (SELECT started FROM locked))) / 2), 0) AS increment
        // `;
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

    // const client = await db.connect();
    // const sql = "UPDATE user_idles SET active = FALSE WHERE user_id = $1";
    // const values = [userId];

    // await client.query("BEGIN");
    // const res = await db.query(sql, values);
    // await client.query("COMMIT");
    // client.release();
    // return res;
}

export async function getIdle(userId) {
    const sql = `
    SELECT 
        EXTRACT(EPOCH FROM started) AS started_unix,
        r.count AS resource_count
    FROM user_idles i
    JOIN user_resources r ON r.user_id = i.user_id
    WHERE i.user_id = $1`;
    const values = [userId];

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
