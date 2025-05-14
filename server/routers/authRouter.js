import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.send({ data: "test" });
});

export default router;
