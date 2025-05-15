import db from "./connection.js";

export async function addUser(user) {
    const username = user.username;
    const email = user.email;
    const hashedPassword = user.password;

    const sql =
        "INSERT INTO users(username, email, password) VALUES($1,$2,$3) RETURNING *";
    const values = [username, email, hashedPassword];

    const res = await db.query(sql, values);
    return res.rows[0];
}

export async function getUser(user) {
    const username = user.username;

    const sql = "SELECT * FROM users WHERE username = $1";
    const values = [username];

    const res = await db.query(sql, values);
    return res.rows[0];
}

export async function userExists(user) {
    const username = user.username;
    const email = user.email;

    const sql = "SELECT * FROM users WHERE username = $1 OR email = $2";
    const values = [username, email];

    const res = await db.query(sql, values);
    return res.rowCount > 0;
}

export async function insertRefreshToken(userId, jti, expiresAt) {
    const sql =
        "INSERT INTO refresh_tokens(user_id, jti, expires_at) VALUES($1, $2, $3)";
    const values = [userId, jti, expiresAt];
    const result = await db.query(sql, values);
    return result.rowCount === 1;
}

export async function deleteAllRefreshTokensByUserId(userId) {
    const sql = "DELETE FROM refresh_tokens WHERE user_id = $1";
    const values = [userId];
    const result = await db.query(sql, values);
    return result.rowCount > 0;
}
