import { io } from "socket.io-client";
import { writable, derived, get } from "svelte/store";
import { refreshUser, setUserIfAuthenticated, user } from "./userStore.js";

let socket;
export const socketStore = derived(user, async ($user, set) => {
    if ($user) {
        // console.log("socketSTore init");
        if (socket) {
            socket.disconnect();
        }

        socket = io("http://localhost:8080", { withCredentials: true });
        set(socket);

        socket.on("connect", () => {
            // console.log("Socket connected!");
        });
        socket.on("connect_error", (error) => {
            // console.log("Socket error:", error);
            // console.log("msg:", error.message);
            if (error.message === "jwt expired") {
                // console.log("refreshing user");
                refreshUser();
            }
        });
    } else {
        if (socket) {
            socket.disconnect();
        }
        set(null);
    }
    return () => {
        if (socket) {
            socket.disconnect();
        }
        set(null);
    };
});
