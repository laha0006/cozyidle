import { get, writable } from "svelte/store";
import { user } from "./userStore.js";
import { socketStore } from "./socketStore.js";
import { getFetchWithRefresh } from "../util/fetch.js";

function createUserItemStore() {
    const { subscribe, set, update } = writable([]);

    const userUnsub = user.subscribe(async ($user) => {
        if ($user) {
            const userItems = await getFetchWithRefresh(
                "/api/users/" + $user.id + "/items"
            );
            set(userItems);
            console.log("items:", userItems);
        }
    });

    const socketUnsub = socketStore.subscribe(async ($socket) => {
        console.log("!!");
        if ($socket) {
            $socket.on("equipped");
            $socket.on("unequipped");
            $socket.on("purchased");
        }
    });

    return {
        subscribe,
        set,
        equip: async (itemId) => {
            const socket = get(socketStore);
            socket.emit("equip", { itemId });
        },
    };
}

export const userItemStore = createItemStore();
