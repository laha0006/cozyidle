import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import db from "../database/connection.js";
const router = Router();

router.use(authenticateToken);

router.get("/", (req, res) => {
    res.send({ message: "Auth succesful!", user: req.user });
});

router.get("/:userId/items", async (req, res) => {
    const { userId } = req.params;

    const sql = `
    SELECT i.name ,
       s.name AS  skill,
       i.bonus, ui.equipped,
       i.id AS item_id, s.id AS skill_id
    FROM user_items ui
    JOIN items i ON i.id = ui.item_id
    JOIN skills s ON s.id = i.skill_id
    WHERE ui.user_id = $1
    `;

    const { rows } = await db.query(sql, [userId]);
    res.send({ data: rows });
});

export default router;
