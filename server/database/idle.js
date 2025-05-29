import db from "./connection.js";

async function startIdle(userId) {
    const sql =
        "UPDATE user_idles SET started = NOW(), active = TRUE WHERE user_id = $1";
    const values = [userId];

    const res = await db.query(sql, values);
    return res.rows[0];
}
