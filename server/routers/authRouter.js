import { Router } from "express";
import { addUser } from "../database/user.js";

const router = Router();

router.get("/", (req, res) => {
    res.send({ data: "test" });
});

router.post("/api/signup", (req, res) => {
    const user = req.body;
    addUser(user);
});

export default router;
