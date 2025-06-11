import {
    deductResource,
    getIdle,
    startIdle,
    stopIdle,
} from "../database/idle.js";
import { IdleClientEvent, IdleServerEvent } from "./events/idleEvents.js";

export async function idleDispatch(event, socket, data) {
    const userId = socket.userId;
    switch (event) {
        case IdleClientEvent.START:
            {
                const { idleId } = data;
                await startIdle(userId, idleId);
                const init = await getIdle(userId, idleId);
                socket.emit(IdleServerEvent.INIT, {
                    idleId,
                    resourceId: init.resource_id,
                    resource_amount: init.resource_amount,
                    started: init.started_unix,
                    speed: init.speed,
                    level: init.level,
                });
            }
            break;
        case IdleClientEvent.STOP:
            {
                const { idleId } = data;
                console.log("idle ID FOR STOP:", idleId);
                const stopped = await stopIdle(userId, idleId);
                console.log("stopped:", stopped);
                if (!stopped) {
                    console.log("bro it's already stopped");
                    return;
                }
                socket.emit(IdleServerEvent.STOPPED, {
                    idleId,
                    resourceId: stopped.resource_id,
                    resource_amount: stopped.resource_amount,
                });
            }
            break;
        case IdleClientEvent.SYNC:
            {
                if (socket.idleState !== "active") return;
                socket.idleState = "updating";

                const { idleId } = data;

                const update = await updateIdle(userId, idleId);
                console.log("UPDATE: ", update);
                const buy = await deductResource(userId, idleId, 10);
                console.log("BUY:", buy);

                socket.idleState = "active";
                socket.emit(IdleServerEvent.UPDATE, {
                    idleId,
                    new_started: update.new_started * 1000,
                    resource_amount: buy?.resource_amount || undefined,
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
