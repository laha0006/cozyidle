import { Router } from "express";
import db from "../database/connection.js";

const router = Router();

router.get("/items", async (req, res) => {
    const sql = `
        SELECT
            i.id AS item_id,
            i.name AS name,
            s.name AS skill,
            s.id AS skill_id,
            i.bonus AS bonus,
            i.price AS price,
            i.skill_requirement AS requirement
        FROM items i
        JOIN skills s ON s.id = i.skill_id ;
    `;
    const { rows } = await db.query(sql);
    res.send({ data: rows });
});

export default router;
