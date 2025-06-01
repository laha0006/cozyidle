import { IdleClientEvent } from "./events/idleEvents.js";
import { idleDispatch } from "./idleHandler.js";

export function registerIdleHandlers(socket) {
    const events = Object.values(IdleClientEvent);
    const userId = socket.userId;
    socket.idleState = "inactive";
    events.forEach((event) => {
        socket.on(event, (...args) => {
            idleDispatch(event, socket, ...args); // });
        });
    });
}
