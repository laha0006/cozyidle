import { IdleClientEvent } from "./events/idleEvents.js";
import { ItemClientEvent } from "./events/itemEvents.js";
import { idleDispatch } from "./idleHandler.js";
import { itemDispatch } from "./itemHandler.js";

const userLocks = new Map();

export function registerIdleHandlers(socket) {
    const idleEvents = Object.values(IdleClientEvent);
    const itemEvents = Object.values(ItemClientEvent);
    const userId = socket.userId;
    if (!userLocks.get(userId)) {
        userLocks.set(userId, new Map());
    }

    idleEvents.forEach((event) => {
        socket.on(event, async (data) => {
            const locks = userLocks.get(userId);
            const { idleId } = data;
            const lock = locks.get(idleId);
            if (!lock) {
                locks.set(idleId, Date.now());
            } else {
                const now = Date.now();
                const diff = now - lock;
                if (diff < 300) {
                    socket.emit("error", {
                        message: "only one action per idle per 300ms!",
                    });
                    return;
                }
            }
            await idleDispatch(event, socket, data); // });
            locks.set(idleId, Date.now());
        });
    });

    itemEvents.forEach((event) => {
        socket.on(event, async (...args) => {
            await itemDispatch(event, socket, ...args);
        });
    });
}
