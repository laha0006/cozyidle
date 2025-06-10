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
        userLocks.set(userId, false);
    }
    idleEvents.forEach((event) => {
        socket.on(event, async (...args) => {
            if (userLocks.get(userId)) {
                return;
            }
            userLocks.set(userId, true);
            await idleDispatch(event, socket, ...args); // });
            userLocks.set(userId, false);
        });
    });

    itemEvents.forEach((event) => {
        socket.on(event, async (...args) => {
            await itemDispatch(event, socket, ...args);
        });
    });
}
