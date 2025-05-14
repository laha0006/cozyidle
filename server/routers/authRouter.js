import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.send({ data: "test" });
});

router.post("/api/signup", (req, res) => {
    const user = req.body;
    res.send({ data: user });
});

export default router;
