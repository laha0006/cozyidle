import jwt from "jsonwebtoken";
import { getUser } from "../database/user.js";
import cookie from "cookie";

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
            if (!userFromDatabase) {
                return res
                    .status(401)
                    .send({ message: "User not found in database" });
            }
            req.user = {
                id: userFromDatabase.id,
                username: userFromDatabase.username,
                email: userFromDatabase.email,
            };
            next();
        }
    );
}

export function socketAuthenticateToken(socket, next) {
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) return next(new Error("no token"));
    const cookies = cookie.parse(cookieHeader);

    jwt.verify(
        cookies.accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) {
                console.log(err);
                return next(new Error(err.message));
            }
            const userFromDatabase = await getUser(decoded);
            if (!userFromDatabase) {
                console.log("no user from database?");
                throw Error("no user!");
            }
            socket.userId = userFromDatabase.id;
            next();
        }
    );
}
