import { getIdle, startIdle, stopIdle, updateIdle } from "../database/idle.js";
import { IdleClientEvent, IdleServerEvent } from "./events/idleEvents.js";

export async function idleDispatch(event, socket, data) {
    switch (event) {
        case IdleClientEvent.START:
            {
                if (socket.idleState === "active") {
                    console.log("already active!");
                    return;
                }
                socket.idleState = "active";

                const init = await startIdleHandler(socket.userId);
                socket.emit(IdleServerEvent.INIT, init);
            }
            break;
        case IdleClientEvent.STOP:
            {
                if (socket.idleState !== "active") {
                    console.log("not active!");
                    return;
                }

                socket.idleState = "inactive";
                const stopped = await stopIdleHandler(socket.userId);
                socket.emit(IdleServerEvent.STOPPED, stopped);
            }
            break;
        case IdleClientEvent.SYNC:
            {
                const updated = await updateIdleHandler(socket.userId);
                socket.emit(IdleServerEvent.UPDATE, updated);
            }
            break;
    }
}

async function startIdleHandler(userId) {
    await startIdle(userId);
    const init = await getIdle(userId);
    return init;
}

async function updateIdleHandler(userId) {
    await updateIdle(userId);
}

async function stopIdleHandler(userId) {
    await stopIdle(userId);
    return await getIdle(userId);
}
