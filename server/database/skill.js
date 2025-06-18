import db from "./connection.js";

export async function skillCheck(userId, skillId, requiredLevel) {
    const sql = `
        SELECT sl.level AS skill_level
            FROM user_experiences ue
            JOIN skill_levels sl ON sl.skill_id = ue.skill_id
            WHERE ue.user_id = $1
            AND ue.skill_id = $2
            AND sl.experience_required <= ue.experience
            ORDER BY sl.level DESC
            LIMIT 1
    `;
    const client = await db.connect();
    try {
        const res = await client.query(sql, [userId, skillId]);
        const userLevel = res.rows[0].skill_level;
        if (userLevel < requiredLevel) {
            const customError = new Error(
                "You do not have the required skill level!"
            );
            customError.isForUser = true;
            throw customError;
        }
        return true;
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
}
