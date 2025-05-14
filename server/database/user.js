import { hashPassword } from "../util/hashing.js";
import db from "./connection.js";

export async function addUser(user) {
    const username = user.username;
    const email = user.email;
    const hashedPassword = user.password;

    const SQL = "INSERT INTO users(username, email, password) VALUES($1,$2,$3)";
    const values = [username, email, hashedPassword];

    const res = await db.query(SQL, values);
}

export async function getUser(user) {
    const username = user.username;

    const SQL = "SELECT * FROM users WHERE username = $1";
    const values = [username];

    const res = await db.query(SQL, values);

    return res.rows[0];
}

export async function userExists(user) {
    const username = user.username;
    const email = user.email;

    const SQL = "SELECT * FROM users WHERE username = $1 OR email = $2";
    const values = [username, email];

    const res = await db.query(SQL, values);
    console.log(typeof res.rowCount);
    console.log(res.rowCount > 0);
    return res.rowCount > 0;
}
