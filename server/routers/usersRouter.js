import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
const router = Router();

router.use(authenticateToken);

router.get("/", (req, res) => {
    res.send({ message: "Auth succesful!", user: req.user });
});

export default router;
