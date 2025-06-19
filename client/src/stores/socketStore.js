import { writable, derived, get } from "svelte/store";

import { io } from "socket.io-client";
import { toast } from "@zerodevx/svelte-toast";

import { refreshUser, user } from "./userStore.js";
import { error } from "../util/toasts.js";

let socket;

export const socketStore = derived(user, async ($user, set) => {
    if ($user) {
        if (socket) {
            socket.disconnect();
        }

        socket = io("http://localhost:8080", { withCredentials: true });
        set(socket);

        socket.on("error", (data) => {
            console.log("socket error:", data);
            error(data.message);
        });

        socket.on("connect", () => {});
        socket.on("connect_error", (error) => {
            if (error.message === "jwt expired") {
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
