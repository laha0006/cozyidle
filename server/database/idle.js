import db from "./connection.js";

export async function startIdle(userId) {
    const sql =
        "UPDATE user_idles SET started = NOW(), active = TRUE WHERE user_id = $1";
    const values = [userId];

    const res = await db.query(sql, values);
    return res;
}

export async function stopIdle(userId) {
    const sql = "UPDATE user_idles SET active = FALSE WHERE user_id = $1";
    const values = [userId];

    const res = await db.query(sql, values);
    return res;
}

export async function getIdle(userId) {
    const sql =
        "SELECT EXTRACT(EPOCH FROM started) AS started_unix FROM user_idles WHERE user_id = $1";
    const values = [userId];

    const res = await db.query(sql, values);
    return res.rows[0].started_unix * 1000;
}

export async function updateIdle(userId) {
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
                    (SELECT started FROM updated ) AS new_started,
                    (SELECT count FROM update_resources ) as new_count;
                `;

    const values = [userId];

    const res = await db.query(sql, values);
    return res.rows[0];
}
