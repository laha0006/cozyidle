import { io } from "socket.io-client";
import { writable, derived, get } from "svelte/store";
import { refreshUser, setUserIfAuthenticated, user } from "./userStore.js";

// export const socketStore = writable(null);

// let socket = null;

// export function initSocket() {
//     if (socket) {
//         socket.disconnect();
//     }

//     console.log("Initializing socket connection...");
//     socket = io("http://localhost:8080", { withCredentials: true });

//     socket.on("connect", () => {
//         console.log("socket connected!");
//     });

//     socket.on("connect_error", (error) => {
//         console.log("error", error);
//     });
//     socketStore.set(socket);
// }

// export function disconnectSocket() {
//     if (socket) {
//         socket.disconnect();
//         socket = null;
//     }
//     socketStore.set(null);
// }

export const socketStore = derived(user, async ($user, set) => {
    let socket;
    if ($user) {
        console.log("DERIVED YO");

        socket = io("http://localhost:8080", { withCredentials: true });
        set(socket);

        socket.on("connect", () => {
            console.log("Socket connected!");
        });
        socket.on("connect_error", (error) => {
            console.log("Socket error:", error);
            console.log("msg:", error.message);
            if (error.message === "jwt expired") {
                console.log("refreshing user");
                refreshUser();
            }
        });
    } else {
        console.log("else");
        set(null);
    }
    return () => {
        console.log("cleanup");
        if (socket) {
            socket.disconnect();
        }
        set(null);
    };
});
