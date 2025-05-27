import { Router } from "express";
import {
    addUser,
    userExists,
    getUser,
    insertRefreshToken,
    deleteAllRefreshTokensByUserId,
    getRefreshTokenByJti,
} from "../database/user.js";
import { hashPassword } from "../util/hashing.js";
import { generateTokens } from "../util/jwt.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.get("/", (req, res) => {
    res.send({ data: "test" });
});

router.post("/api/login", async (req, res) => {
    const user = req.body;
    const password = user.password;

    const userFromDatabase = await getUser(user);
    console.log(userFromDatabase);
    if (!userFromDatabase) {
        return res
            .status(404)
            .send({ status: 404, message: "Incorrect username or password" });
    }
    if (!(await bcrypt.compare(password, userFromDatabase.password))) {
        return res
            .status(403)
            .send({ message: "Incorrect username or password" });
    }
    if (!userFromDatabase.is_active) {
        return res.status(403).send({ message: "Account is suspended" });
    }

    const { accessToken, refreshToken, jti } = generateTokens(userFromDatabase);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // + 7 days from now
    await insertRefreshToken(userFromDatabase.id, jti, expiresAt);

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

    res.send({
        status: 200,
        message: "Succesfully logged in!",
        user: {
            username: userFromDatabase.username,
            email: userFromDatabase.email,
            id: userFromDatabase.id,
        },
    });
});

router.post("/api/signup", async (req, res) => {
    const user = req.body;
    console.log("USER: ", user);

    if (await userExists(user)) {
        return res
            .status(400)
            .send({ message: "username or email already exists!" });
    }

    user.password = await hashPassword(user.password);
    const userFromDatabase = await addUser(user);
    console.log(userFromDatabase);

    const { accessToken, refreshToken, jti } = generateTokens(user);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // + 7 days from now
    await insertRefreshToken(userFromDatabase.id, jti, expiresAt);

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

    res.status(200).send({
        message: "You've succesfully signed up!",
        user: {
            id: userFromDatabase.id,
            username: userFromDatabase.username,
            email: userFromDatabase.email,
        },
    });
});

router.post("/api/refresh", async (req, res) => {
    const cookies = req.cookies;
    if (!cookies.refreshToken) {
        return res.status(401).send({ message: "No refresh token!" });
    }

    try {
        const decoded = jwt.verify(
            cookies.refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const userFromDatabase = await getUser(decoded);
        if (!userFromDatabase) {
            return res.status(404).send({
                message: "Failed to find user",
            });
        }

        const refreshTokenFromDatabase = await getRefreshTokenByJti(
            decoded.jti
        );

        if (!refreshTokenFromDatabase) {
            return res.status(401).send({ message: "invalid refreshToken" });
        }
        if (refreshTokenFromDatabase.revoked) {
            return res.status(401).send({ message: "invalid refresh token" });
        }

        const { accessToken, refreshToken, jti } =
            generateTokens(userFromDatabase);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // + 7 days from now
        await insertRefreshToken(userFromDatabase.id, jti, expiresAt);

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

        res.send({
            message: "Successfully refreshed tokens!",
            user: userFromDatabase,
        });
    } catch (error) {
        console.log(error);
        res.status(401).send({ message: "Could not verify token" });
    }
});

router.post("/api/logout", authenticateToken, async (req, res) => {
    const userId = req.user.id;

    await deleteAllRefreshTokensByUserId(userId);

    res.clearCookie("accessToken", {
        httpOnlytp: true,
        secure: false,
    });

    res.clearCookie("refreshToken", {
        httpOnlytp: true,
        secure: false,
    });

    res.send({ message: "Succesfully logged out!" });
});

export default router;
