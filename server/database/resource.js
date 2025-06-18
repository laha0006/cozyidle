import db from "./connection.js";

export async function deductResource(userId, resourceId, amount) {
    const sql = `
    UPDATE user_resources
    SET amount = amount - $3
    WHERE user_id = $1
        AND resource_id = $2
        AND amount >= $3 
    RETURNING amount as resource_amount
    `;

    const values = [userId, resourceId, amount];
    try {
        const res = await db.query(sql, values);
        console.log("deduct:", res.rows);
        if (res.rows.length < 1) {
            const customError = new Error("not enough resources!");
            customError.isForUser = true;
            throw customError;
        }
        return res.rows[0];
    } catch (error) {
        throw error;
    }
}
