import "dotenv/config";
import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

const app = express();
app.use(cookieParser());
app.use(express.json());

import { socketAuthenticateToken } from "./middleware/auth.js";
import { registerIdleHandlers } from "./socket/handlers.js";

import authRouter from "./routers/authRouter.js";
app.use(authRouter);
import usersRouter from "./routers/usersRouter.js";
app.use("/api/users", usersRouter);
import skillsRouter from "./routers/skillsRouter.js";
app.use(skillsRouter);
import timeRouter from "./routers/timeRouter.js";
app.use(timeRouter);
import upgradesRouter from "./routers/upgradeRouter.js";
app.use(upgradesRouter);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Allow all origins
        // origin: "*", // Allow all origins
        methods: ["GET", "POST"],
        credentials: true,
    },
});

io.use(socketAuthenticateToken);

const socketStore = new Map();

io.on("connection", (socket) => {
    const prevSocket = socketStore.get(socket.userId);
    if (!prevSocket) {
        socketStore.set(socket.userId, socket);
    } else {
        prevSocket.disconnect(true);
        socketStore.delete(socket.userId);
    }

    registerIdleHandlers(socket);

    socket.on("disconnect", () => {
        socketStore.delete(socket.userId);
    });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, console.log(`Server listening on ${PORT}`));
