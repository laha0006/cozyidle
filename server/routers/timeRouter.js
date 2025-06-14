import { Router } from "express";
import db from "../database/connection.js";

const router = Router();

router.get("/api/now", async (req, res) => {
    res.send({ now: Date.now() });
});

export default router;
