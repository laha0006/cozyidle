import db from "./connection.js";

function startIdle(userId) {
    const sql = "UPDATE user_idles SET ... WHERE user_id = $1";
}
