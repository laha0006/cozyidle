import { Router } from "express";
import db from "../database/connection.js";

const router = Router();

router.get("/api/upgrades", async (req, res) => {
    const sql = `
        SELECT * FROM idle_levels
        ORDER BY idle_id, level
    `;
    const result = await db.query(sql);
    res.send({ data: result.rows });
});

export default router;
