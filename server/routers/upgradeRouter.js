import { Router } from "express";
import db from "../database/connection.js";

const router = Router();

router.get("/api/upgrades", async (req, res) => {
    const sql = `
        SELECT * FROM idle_levels
        ORDER BY idle_id, level
    `;
    const result = await db.query(sql);
    const data = result.rows;
    const cleanedData = data.map(
        ({
            idle_id,
            level_requirement,
            speed_seconds,
            resource_id,
            ...rest
        }) => {
            return {
                ...rest,
                idleId: idle_id,
                levelReq: level_requirement,
                speedSeconds: speed_seconds,
                resourceId: resource_id,
            };
        }
    );
    res.send({ data: cleanedData });
});

export default router;
