import { io } from "socket.io-client";
import { readable } from "svelte/store";

const socket = io("http://localhost:8080");

socket.on("connect", () => {
    console.log("socket connected!");
});

socket.on("connect_error", (error) => {
    console.log("error", error);
});

console.log("stuff happend");

export const socketStore = readable(socket);
