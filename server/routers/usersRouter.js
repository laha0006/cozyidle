import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
const router = Router();

router.use(authenticateToken);

router.get("/api/users", (req, res) => {
    res.send({ message: "Auth succesful!" });
});

export default router;
