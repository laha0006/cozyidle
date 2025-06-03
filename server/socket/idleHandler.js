import {
    deductResource,
    getIdle,
    startIdle,
    stopIdle,
    updateIdle,
} from "../database/idle.js";
import { IdleClientEvent, IdleServerEvent } from "./events/idleEvents.js";

export async function idleDispatch(event, socket, data) {
    console.log("DATA:", data);
    const userId = socket.userId;
    switch (event) {
        case IdleClientEvent.START:
            {
                if (socket.idleState !== "inactive") {
                    console.log("already active!");
                    return;
                }
                socket.idleState = "starting";

                const { idleId } = data;

                await startIdle(userId, idleId);
                const init = await getIdle(userId, idleId);
                console.log("INIT:", init);
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

                const { idleId } = data;

                const stopped = await stopIdle(userId, idleId);

                socket.idleState = "inactive";

                socket.emit(IdleServerEvent.STOPPED, stopped);
            }
            break;
        case IdleClientEvent.SYNC:
            {
                if (socket.idleState !== "active") return;
                socket.idleState = "updating";

                const { idleId } = data;

                const update = await updateIdle(userId, idleId);
                const buy = await deductResource(userId, idleId, 10);
                console.log("BUY:", buy);

                socket.idleState = "active";
                socket.emit(IdleServerEvent.UPDATE, {
                    new_started: update.new_started * 1000,
                    resource_amount: buy.resource_amount,
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
