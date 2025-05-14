import express from "express";
import { Server} from "socket.io";
import http from "http";

const test = [1,2,3]

const app = express();
const server = http.createServer(app);
const io = 
