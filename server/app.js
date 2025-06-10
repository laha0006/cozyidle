import "dotenv/config";
import express from "express";
import { Server } from "socket.io";
import http from "http";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(express.json());

import { socketAuthenticateToken } from "./middleware/auth.js";
import { registerIdleHandlers } from "./socket/handlers.js";

import authRouter from "./routers/authRouter.js";
app.use(authRouter);
import usersRouter from "./routers/usersRouter.js";
app.use("/api/users", usersRouter);
import userIdlesRouter from "./routers/userIdlesRouter.js";
app.use("/api/users", userIdlesRouter);
import itemsRouter from "./routers/itemsRouter.js";
app.use("/api", itemsRouter);

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

const socketStore = new Map();

io.on("connection", (socket) => {
    console.log("A socket connected", socket.id);
    socketCount++;
    const prevSocket = socketStore.get(socket.userId);
    if (!prevSocket) {
        console.log("set socket in socketSTore");
        socketStore.set(socket.userId, socket);
    } else {
        console.log("disconnect, prev socket");
        prevSocket.disconnect(true);
        socketStore.delete(socket.userId);
    }
    console.log("user id", socket.userId);
    console.log("count: ", socketCount);

    registerIdleHandlers(socket);

    socket.on("disconnect", () => {
        socketStore.delete(socket.userId);
        socketCount--;
        console.log("socket disconnected:", socket.id);
        console.log("count: ", socketCount);
    });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, console.log(`Server listening on ${PORT}`));
