import db from "./connection.js";

export async function startIdle(userId) {
    const sql =
        "UPDATE user_idles SET started = NOW(), active = TRUE WHERE user_id = $1";
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
                SELECT started FROM user_idles WHERE user_id = $1 FOR UPDATE
                ),
                updated AS (
                UPDATE user_idles 
                SET started = NOW()
                WHERE user_id = $1
                )
                UPDATE user_resources
                SET count = count + FLOOR(EXTRACT(EPOCH FROM (NOW() - (SELECT started FROM old))) / 2)
                WHERE user_id = $1;`;
    const values = [userId];

    const res = await db.query(sql, values);
    return res;
}
