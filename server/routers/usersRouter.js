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
    const allItemsSql = `
    SELECT
        i.name AS name,
        s.name AS skill,
        i.bonus AS bonus,
        i.price,
        i.skill_requirement AS requirement,
        ui.equipped,
        i.id AS item_id,
        s.id AS skill_id,
        CASE WHEN ui.user_id IS NULL THEN false ELSE true END AS owned
    FROM items i
    JOIN skills s ON s.id = i.skill_id
    LEFT JOIN user_items ui
        ON ui.item_id = i.id AND ui.user_id = $1`;
    const sql = `
    SELECT 
        i.name AS name,
        s.name AS  skill,
        i.bonus AS bonus,
        i.price,
        i.skill_requirement AS requirement,
        ui.equipped,
        i.id AS item_id, 
        s.id AS skill_id
    FROM user_items ui
    JOIN items i ON i.id = ui.item_id
    JOIN skills s ON s.id = i.skill_id
    WHERE ui.user_id = $1
    `;

    const { rows } = await db.query(allItemsSql, [userId]);
    res.send({ data: rows });
});

export default router;
