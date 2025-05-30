import { IdleClientEvent } from "./events/idleEvents.js";
import { idleDispatch } from "./idleHandler.js";

export function registerIdleHandlers(socket) {
    const events = Object.values(IdleClientEvent);

    events.forEach((event) => {
        socket.on(event, (...args) => {
            idleDispatch(event, socket, ...args);
        });
    });
}
