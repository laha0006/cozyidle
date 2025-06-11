import { Router } from "express";
import db from "../database/connection.js";

const router = Router();

router.get("/api/skills/levels", async (req, res) => {
    console.log("test");
    const sql = `
        SELECT 
            *
        FROM skill_levels
    `;
    const result = await db.query(sql);
    res.send({ data: result.rows });
});

export default router;
