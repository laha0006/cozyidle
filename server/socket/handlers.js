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
            console.log("LOCK:", lock);
            if (!lock) {
                console.log("no lock?");
                locks.set(idleId, { ts: Date.now(), count: 0 });
            } else {
                const now = Date.now();
                const diff = now - lock.ts;
                const blocked = lock.blocked;
                if (blocked) {
                    const blockDiff = blocked - now;
                    console.log("blockDiff:", blockDiff);
                    if (blockDiff < 0) {
                        lock.blocked = null;
                        lock.count = 0;
                    } else {
                        socket.emit("error", {
                            message: `Locked for ${blockDiff / 1000} seconds`,
                        });
                        return;
                    }
                }
                if (diff < 500) {
                    console.log("still counting");
                    lock.count++;
                    if (lock.count > 5) {
                        console.log("COUNT:", lock.count);
                        lock.blocked = Date.now() + 5000;
                        socket.emit("error", { message: "Take a chill pill!" });
                        return;
                    }
                }
            }
            await idleDispatch(event, socket, data); // });
            const oldLock = locks.get(idleId);
            locks.set(idleId, { ts: Date.now(), count: oldLock.count });
        });
    });

    itemEvents.forEach((event) => {
        socket.on(event, async (...args) => {
            await itemDispatch(event, socket, ...args);
        });
    });
}
