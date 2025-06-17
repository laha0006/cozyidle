import { Router } from "express";
import db from "../database/connection.js";

const router = Router();

router.get("/api/skills/levels", async (req, res) => {
    const sql = `
        SELECT 
            *
        FROM skill_levels
    `;
    const result = await db.query(sql);
    res.send({ data: result.rows });
});

router.get("/api/skills/:skillId/leaderboard", async (req, res) => {
    const { skillId } = req.params;
    const sql = `
    WITH user_skill_levels AS (
        SELECT DISTINCT ON (ue.user_id)
            ue.user_id,
            sl.level,
            ue.skill_id,
            ue.experience
        FROM
            user_experiences ue
            JOIN skill_levels sl ON sl.skill_id = ue.skill_id
        WHERE
            ue.skill_id = $1
            AND sl.experience_required <= ue.experience
        ORDER BY
            ue.user_id,
            sl.level DESC
        )
        SELECT
        user_id,
        skill_id,
        level,
        experience,
        u.username
        FROM
        user_skill_levels usl
        JOIN users u ON u.id = usl.user_id
        ORDER BY
        level DESC,
        experience DESC
        LIMIT 100
    `;

    const client = await db.connect();
    try {
        const result = await client.query(sql, [skillId]);
        const leaderboard = result.rows;
        res.send({ data: leaderboard });
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
});

export default router;
