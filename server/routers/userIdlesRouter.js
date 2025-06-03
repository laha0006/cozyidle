import { Router } from "express";

const router = Router();

router.get("/users/:userId/idles", async (req, res) => {
    console.log("get idle for user!");
});

export default router;
