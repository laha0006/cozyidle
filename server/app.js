import express from "express";
import { Server } from "socket.io";
import http from "http";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(express.json());

import authRouter from "./routers/authRouter.js";
app.use(authRouter);

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
    console.log("A socket connected", socket.id);
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, console.log(`Server listening on ${PORT}`));
