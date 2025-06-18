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

export async function sellResource(userId, resourceId, amount) {
    const sql = `
    WITH value AS (SELECT r.value
        FROM user_resources ur
        JOIN resources r ON r.id = ur.resource_id
        WHERE ur.user_id = $1
        AND resource_id = $2),
        sell AS (
            UPDATE user_resources ur
            SET amount = ur.amount + (v.value * $3)
            FROM value v
            WHERE ur.user_id = $1
            AND ur.resource_id = 1
            RETURNING ur.amount
        ) SELECT
            amount
        FROM sell
    `;

    const client = await db.connect();
    try {
        await deductResource(userId, resourceId, amount);
        const goldRes = await client.query(sql, [userId, resourceId, amount]);
        return { gold: goldRes.rows[0].amount, resourceId, amount };
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
}
