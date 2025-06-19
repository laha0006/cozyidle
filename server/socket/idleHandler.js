import {
    buyUpgrade,
    getIdle,
    startIdle,
    stopIdle,
    unlockIdle,
} from "../database/idle.js";
import { IdleClientEvent, IdleServerEvent } from "./events/idleEvents.js";

let startedTime;
let stoppedTime;

export async function idleDispatch(event, socket, data) {
    const userId = socket.userId;
    switch (event) {
        case IdleClientEvent.START:
            {
                const { idleId } = data;
                startedTime = Date.now();
                try {
                    await startIdle(userId, idleId);
                    const init = await getIdle(userId, idleId);
                    socket.emit(IdleServerEvent.INIT, {
                        idleId,
                        resourceId: init.resource_id,
                        resourceAmount: init.resource_amount,
                        started: init.started_unix,
                        speed: init.speed,
                        level: init.level,
                        diff: init.diff,
                        serverNow: init.server_now,
                    });
                } catch (error) {
                    socket.emit("error", { message: error.message });
                }
            }
            break;
        case IdleClientEvent.STOP:
            {
                const { idleId } = data;
                stoppedTime = Date.now();
                const stopped = await stopIdle(userId, idleId);
                if (!stopped) {
                    return;
                }
                socket.emit(IdleServerEvent.STOPPED, {
                    idleId,
                    resourceId: stopped.resource_id,
                    resourceAmount: stopped.resource_amount,
                });
            }
            break;
        case IdleClientEvent.UPGRADE:
            {
                const { upgradeId } = data;
                try {
                    const bought = await buyUpgrade(userId, upgradeId);
                    socket.emit(IdleServerEvent.UPGRADED, bought);
                } catch (error) {
                    console.log(error.message);
                    socket.emit("error", { message: error.message });
                }
            }
            break;
        case IdleClientEvent.UNLOCK:
            {
                const { idleId } = data;
                try {
                    await unlockIdle(userId, idleId);
                    socket.emit(IdleServerEvent.UNLOCKED, { idleId });
                } catch (error) {
                    if (error.isForUser) {
                        socket.emit("error", { message: error.message });
                    } else {
                        console.log(error);
                    }
                }
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
