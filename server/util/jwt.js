import jwt from "jsonwebtoken";

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
            expiresIn: "15m",
        }
    );
}
