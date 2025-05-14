import { Router } from "express";
import { addUser, userExists } from "../database/user.js";
import { hashPassword } from "../util/hashing.js";
import { generateTokens } from "../util/jwt.js";

const router = Router();

router.get("/", (req, res) => {
    res.send({ data: "test" });
});

router.post("/api/signup", async (req, res) => {
    const user = req.body;

    if (await userExists(user)) {
        return res
            .status(400)
            .send({ message: "username or email already exists!" });
    }

    user.password = await hashPassword(user.password);
    addUser(user);

    const { accessToken, refreshToken } = generateTokens(user);
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        maxAge: 15 * 60 * 1000, // 15 minutes in ms
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });

    res.status(200).send({ data: "test" });
});

export default router;
