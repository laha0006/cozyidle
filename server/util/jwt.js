import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export function generateAccessToken(user) {
    const username = user.username;
    const email = user.email;
    return jwt.sign(
        {
            username,
            email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "10s",
        }
    );
}

export function generateRefreshToken(user, jti) {
    const username = user.username;
    const email = user.email;
    return jwt.sign(
        {
            username,
            email,
            jti,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "7d",
        }
    );
}

export function generateTokens(user) {
    const accessToken = generateAccessToken(user);
    const jti = uuidv4();
    const refreshToken = generateRefreshToken(user, jti);
    return { accessToken, refreshToken, jti };
}
