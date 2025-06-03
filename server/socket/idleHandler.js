import {
    deductResource,
    getIdle,
    setIdleState,
    startIdle,
    stopIdle,
    updateIdle,
} from "../database/idle.js";
import { IdleClientEvent, IdleServerEvent } from "./events/idleEvents.js";

export async function idleDispatch(event, socket, data) {
    console.log("DATA:", data);
    switch (event) {
        case IdleClientEvent.START:
            {
                if (socket.idleState !== "inactive") {
                    console.log("already active!");
                    return;
                }
                socket.idleState = "starting";

                await setIdleState(socket.userId, true);
                const init = await getIdle(socket.userId);
                socket.idleState = "active";
                socket.emit(IdleServerEvent.INIT, init);
            }
            break;
        case IdleClientEvent.STOP:
            {
                if (socket.idleState !== "active") {
                    console.log("not active!");
                    return;
                }

                socket.idleState = "sopping";
                const stopped = await stopIdle(socket.userId);
                socket.idleState = "inactive";

                socket.emit(IdleServerEvent.STOPPED, stopped);
            }
            break;
        case IdleClientEvent.SYNC:
            {
                if (socket.idleState !== "active") return;
                socket.idleState = "updating";

                const update = await updateIdle(socket.userId);
                const buy = await deductResource(socket.userId, 10);
                socket.idleState = "active";
                socket.emit(IdleServerEvent.UPDATE, {
                    new_started: update.new_started * 1000,
                    resource_count: buy.resource_count,
                });
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
