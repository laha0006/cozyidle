import { hashPassword } from "../util/hashing.js";
import db from "./connection.js";

export async function addUser(user) {
    const username = user.username;
    const email = user.email;
    const hashedPassword = await hashPassword(user.password);
    console.log(username);
    console.log(username);
    console.log(email);
    console.log(hashedPassword);

    const SQL = "INSERT INTO users(username, email, password) VALUES($1,$2,$3)";
    const values = [username, email, hashedPassword];

    const res = await db.query(SQL, values);
    console.log(res.rowCount);
}
