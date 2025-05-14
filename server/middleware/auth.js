import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
    const cookies = req.cookies;
    if (!cookies.accessToken) {
        return res.status(401).send({ message: "no access token" });
    }

    jwt.verify(
        cookies.accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                console.log(err);
                return res.sendStatus(403);
            }
            req.user = {
                username: decoded.username,
                email: decoded.email,
            };
            next();
        }
    );
}
