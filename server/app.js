import "dotenv/config";
import express from "express";
import { Server } from "socket.io";
import { getIdle, startIdle, updateIdle } from "./database/idle.js";
import http from "http";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(express.json());

import authRouter from "./routers/authRouter.js";
app.use(authRouter);
import usersRouter from "./routers/usersRouter.js";
import {
    authenticateToken,
    socketAuthenticateToken,
} from "./middleware/auth.js";
app.use(usersRouter);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Allow all origins
        // origin: "*", // Allow all origins
        methods: ["GET", "POST"],
        credentials: true,
    },
});

let socketCount = 0;

io.use(socketAuthenticateToken);

io.on("connection", (socket) => {
    console.log("A socket connected", socket.id);
    socketCount++;
    console.log("count: ", socketCount);

    socket.on("disconnect", () => {
        socketCount--;
        console.log("socket disconnected:", socket.id);
        console.log("count: ", socketCount);
    });
});

// await startIdle(1);
// const res = await getIdle(1);
// console.log("res:", res);
// const res = await updateIdle(1);
// console.log("EVEN MORE?");
// console.log("RES:", res);
// console.log("tst");
const PORT = process.env.PORT || 8080;

server.listen(PORT, console.log(`Server listening on ${PORT}`));
