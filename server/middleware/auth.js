import jwt from "jsonwebtoken";
import { getUser } from "../database/user.js";

export function authenticateToken(req, res, next) {
    const cookies = req.cookies;
    if (!cookies.accessToken) {
        return res.status(401).send({ message: "no access token" });
    }

    jwt.verify(
        cookies.accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) {
                console.log(err);
                return res.status(401).send({ message: err.message });
            }
            const userFromDatabase = await getUser(decoded);
            req.user = {
                id: userFromDatabase.id,
                username: userFromDatabase.username,
                email: userFromDatabase.email,
            };
            next();
        }
    );
}
