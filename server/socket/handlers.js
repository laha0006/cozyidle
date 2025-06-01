import { IdleClientEvent } from "./events/idleEvents.js";
import { idleDispatch } from "./idleHandler.js";

const userLocks = new Map();

export function registerIdleHandlers(socket) {
    const events = Object.values(IdleClientEvent);
    const userId = socket.userId;

    if (!userLocks.get(userId)) {
        userLocks.set(userId, false);
    }
    if (userLocks.get(userId)) {
        console.log(">>>>>>>>>>>>>> DROPPED <<<<<<<<<<<<<<<");
        return;
    }
    socket.idleState = "inactive";
    events.forEach((event) => {
        socket.on(event, async (...args) => {
            await idleDispatch(event, socket, ...args); // });
            userLocks.set(userId, false);
        });
    });
}
