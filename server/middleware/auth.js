import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
    const cookies = req.cookies;
    if (!cookies.accessToken) {
        return res.status(403).send({ message: "no access token" });
    }

    jwt.verify(
        cookies.accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        (err, token) => {
            if (err) {
                console.log(err);
                return res.sendStatus(403);
            }
            req.user = {
                username: token.username,
                email: token.email,
            };
            next();
        }
    );
}
