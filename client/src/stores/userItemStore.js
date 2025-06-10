import { get, writable } from "svelte/store";
import { user } from "./userStore.js";
import { socketStore } from "./socketStore.js";
import { getFetchWithRefresh } from "../util/fetch.js";

export const ItemClientEvent = Object.freeze({
    EQUIP: "item:client:equip",
    UNEQIUP: "item:client:unequip",
    BUY: "item:client:buy",
});

export const ItemServerEvent = Object.freeze({
    EQUIPPED: "item:server:equipped",
    UNEQUIPPED: "item:server:unequipped",
    BOUGHT: "item:server:bought",
});

function createUserItemStore() {
    const { subscribe, set, update } = writable([]);

    const userUnsub = user.subscribe(async ($user) => {
        if ($user) {
            const userItems = await getFetchWithRefresh(
                "/api/users/" + $user.id + "/items"
            );
            set(userItems.data);
            console.log("items:", userItems);
        }
    });

    const socketUnsub = socketStore.subscribe(async ($socket) => {
        console.log("!!");
        if ($socket) {
            $socket.on(ItemServerEvent.EQUIPPED, (data) => {
                console.log("equipped:", data);
                update((items) => {
                    return items.map((item) => {
                        if (item.item_id !== data.itemId) return item;
                        return {
                            ...item,
                            equipped: true,
                        };
                    });
                });
            });
            $socket.on(ItemServerEvent.UNEQUIPPED, (data) => {
                console.log("unequip", data);
                update((items) => {
                    return items.map((item) => {
                        if (item.item_id !== data.itemId) return item;
                        return {
                            ...item,
                            equipped: false,
                        };
                    });
                });
            });
            $socket.on("purchased");
        }
    });

    return {
        subscribe,
        set,
        equip: async (itemId) => {
            const socket = get(socketStore);
            socket.emit(ItemClientEvent.EQUIP, { itemId });
        },
        unquip: async (itemId) => {
            const socket = get(socketStore);
            socket.emit(ItemClientEvent.UNEQIUP, { itemId });
        },
    };
}

export const userItemStore = createUserItemStore();
