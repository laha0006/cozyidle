import { io } from "socket.io-client";
import { writable } from "svelte/store";

export const socketStore = writable(null);

let socket = null;

export function initSocket() {
    if (socket) {
        socket.disconnect();
    }

    console.log("Initializing socket connection...");
    socket = io("http://localhost:8080", { withCredentials: true });

    socket.on("connect", () => {
        console.log("socket connected!");
    });

    socket.on("connect_error", (error) => {
        console.log("error", error);
    });
    socketStore.set(socket);
}

export function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
    socketStore.set(null);
}
