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
    const { subscribe, set, update } = writable(null);

    const socketUnsub = socketStore.subscribe(async ($socket) => {
        if ($socket) {
            $socket.on(ItemServerEvent.EQUIPPED, (data) => {
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
            $socket.on(ItemServerEvent.BOUGHT, (data) => {
                update((items) => {
                    return items.map((item) => {
                        if (item.item_id !== data.itemId) return item;
                        return {
                            ...item,
                            owned: true,
                        };
                    });
                });
            });
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
        buy: async (itemId) => {
            const socket = get(socketStore);
            socket.emit(ItemClientEvent.BUY, { itemId });
        },
    };
}

export const userItemStore = createUserItemStore();
