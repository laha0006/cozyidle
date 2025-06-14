import { Router } from "express";
import db from "../database/connection.js";
import { authenticateToken } from "../middleware/auth.js";
import { updateIdles } from "../database/idle.js";

const router = Router();

router.get("/:userId/idles", async (req, res) => {
    const { userId } = req.params;

    await updateIdles(userId);

    const sql = `
    WITH user_skill_level AS (
        SELECT DISTINCT ON (sl.skill_id)
            sl.level AS skill_level,
                sl.skill_id AS skill_id
        FROM user_experiences ue
        JOIN skill_levels sl
        ON sl.skill_id = ue.skill_id
        WHERE ue.user_id = 1
        AND sl.experience_required <= ue.experience
        ORDER BY sl.skill_id ,sl.level DESC
    ),
    item_bonus AS (
        SELECT i.bonus AS bonus, i.skill_id AS skill_id
        FROM items i
        JOIN user_items ui ON ui.item_id = i.id
        WHERE user_id = $1
        AND ui.equipped IS TRUE
    ),
    init AS (
        SELECT i.name AS idle,
            i.id as idle_id,
            EXTRACT(EPOCH FROM NOW())*1000 as now_unix,
            usl.skill_level AS skill_level,
            r.id as resource_id,
            s.name AS skill,
            s.id AS skill_id,
            r.name AS resource,
            ur.amount AS amount,
            ui.unlocked AS unlocked,
            ui.active AS active,
            GREATEST(FLOOR((il.speed_seconds * POWER(0.98, usl.skill_level))),2) AS speed,
            ui.level AS level,
            COALESCE(ib.bonus, 0) AS bonus,
            EXTRACT(EPOCH FROM ui.started) * 1000 AS started
        FROM user_idles ui
            JOIN idles i
                ON ui.idle_id = i.id
            JOIN resources r
                ON i.resource_id = r.id
            JOIN skills s
                ON s.id = i.skill_id
            JOIN user_resources ur
                ON ur.resource_id = r.id AND ur.user_id = $1
            JOIN idle_levels il
                ON il.level = ui.level AND il.idle_id = ui.idle_id
            JOIN user_skill_level usl
                ON usl.skill_id = s.id
            LEFT JOIN item_bonus ib
                ON ib.skill_id = s.id
        WHERE ui.user_id = $1)
        SELECT
            idle,
            skill_level,
            idle_id,
            resource_id,
            skill,
            skill_id,
            resource,
            amount,
            unlocked,
            active,
            speed,
            bonus+1 AS increment,
            started,
            (EXTRACT(EPOCH FROM NOW()) * 1000) - started AS diff,
            level,
            now_unix
        FROM init`;

    const { rows } = await db.query(sql, [userId]);
    rows[0].started = Number(rows[0].started);
    console.log("INIT STARTED:", rows[0].started);
    res.send({ data: rows });
});

export default router;
