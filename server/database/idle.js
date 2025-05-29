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
