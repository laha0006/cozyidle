import { Router } from "express";
import db from "../database/connection.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.get("/:userId/idles", authenticateToken, async (req, res) => {
    console.log("/api/users/id/idles hit!");
    const { userId } = req.params;
    console.log("userID:", userId);
    console.log("req.params", req.params);
    const sql = `
        SELECT i.name AS idle,
            s.name AS skill,
            r.name AS resource,
            ur.amount AS amount,
            ui.unlocked AS unlocked,
            ui.active AS active
        FROM user_idles ui
            JOIN idles i
                ON ui.idle_id = i.id
            JOIN resources r
                ON i.resource_id = r.id
            JOIN skills s
                ON s.id = i.skill_id
            JOIN user_resources ur
                ON ur.resource_id = r.id AND ur.user_id = $1
        WHERE ui.user_id = $1;
    `;

    const { rows } = await db.query(sql, [userId]);
    res.send({ data: rows });
});

export default router;
