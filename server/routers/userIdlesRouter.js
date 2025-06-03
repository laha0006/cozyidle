import { Router } from "express";
import db from "../database/connection.js";

const router = Router();

router.get("/api/users/:userId/idles", async (req, res) => {
    console.log("/api/users/id/idles hit!");
    const { userId } = req.params;
    const sql = `
        SELECT * FROM user_idles
        WHERE user_id = $1
    `;

    const { rows } = await db.query(sql, [userId]);
    res.send({ data: rows });
});

export default router;
