import { IdleClientEvent } from "./events/idleEvents.js";
import { idleDispatch } from "./idleHandler.js";

const userLocks = new Map();

export function registerIdleHandlers(socket) {
    const events = Object.values(IdleClientEvent);
    const userId = socket.userId;

    if (!userLocks.get(userId)) {
        // console.log("set false");
        userLocks.set(userId, false);
    }
    events.forEach((event) => {
        socket.on(event, async (...args) => {
            if (userLocks.get(userId)) {
                console.log(">>>>>>>>>>>>>> DROPPED <<<<<<<<<<<<<<<");
                return;
            }
            userLocks.set(userId, true);
            console.log(event, socket.id, socket.userId);
            await idleDispatch(event, socket, ...args); // });
            console.log(event, socket.id, socket.userId);
            userLocks.set(userId, false);
        });
    });
}
