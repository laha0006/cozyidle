import { derived, get, writable } from "svelte/store";
import { user } from "./userStore.js";
import { getFetchWithRefresh } from "../util/fetch.js";
import { socketStore } from "./socketStore.js";

const IdleServerEvent = Object.freeze({
    INIT: "idle:server:init",
    UPDATE: "idle:server:update",
    STOPPED: "idle:server:stopped",
});

const IdleClientEvent = Object.freeze({
    START: "idle:client:start",
    STOP: "idle:client:stop",
    SYNC: "idle:client:sync",
});
function createIdleStore() {
    const { subscribe, set, update } = writable([]);

    const resources = new Map();
    let rafLoopId;

    function loop() {
        update((idles) => {
            return idles.map((idle) => {
                const resourceId = idle.resource_id;
                const resource = resources.get(resourceId);
                if (!idle.active) {
                    return { ...idle, amount: resource };
                } else {
                    const now = Date.now();
                    const speed = idle.speed * 1000;
                    const progress = Math.min(
                        (now - idle.lastIncrement) / speed,
                        1
                    );
                    const incrementCount = Math.floor(
                        (now - idle.lastIncrement) / speed
                    );
                    resources.set(resourceId, resource + incrementCount);
                    return {
                        ...idle,
                        amount: resource + incrementCount,
                        lastIncrement:
                            idle.lastIncrement + incrementCount * speed,
                        progress,
                    };
                }
            });
        });
        rafLoopId = requestAnimationFrame(loop);
    }

    let socketUnsub = socketStore.subscribe(async ($socketStore) => {
        if ($socketStore) {
            $socketStore.on(IdleServerEvent.INIT, (data) => {
                const { idleId, resourceId, resource_amount, started } = data;
                const startedTime = Math.floor(+started);
                resources.set(resourceId, resource_amount);
                update((idles) => {
                    return idles.map((idle) => {
                        if (idle.idle_id !== idleId) return idle;
                        return {
                            ...idle,
                            started: startedTime,
                            active: true,
                            lastIncrement: Date.now(),
                        };
                    });
                });
            });

            $socketStore.on(IdleServerEvent.STOPPED, (data) => {
                const { idleId, resourceId, resource_amount } = data;
                resources.set(resourceId, resource_amount);
                update((idles) => {
                    return idles.map((idle) => {
                        if (idle.idle_id !== idleId) return idle;
                        return { ...idle, active: false, progress: 0 };
                    });
                });
            });
        }
    });

    let userUnsub = user.subscribe(async ($user) => {
        if ($user) {
            const init = await getFetchWithRefresh(
                "/api/users/" + $user.id + "/idles"
            );

            const clientNow = Date.now();

            const idles = init.data.map((idle) => {
                const startedTime = Math.floor(+idle.started);
                const serverNow = Math.floor(+idle.now_unix);
                const timeDiff = serverNow - clientNow;
                const clientAdjustTime = startedTime - timeDiff;
                return {
                    ...idle,
                    lastIncrement: clientAdjustTime,
                    progress: 0,
                };
            });
            idles.forEach((idle) => {
                if (resources.get(idle.resource_id)) return;
                resources.set(idle.resource_id, idle.amount);
            });
            set(idles);
            loop();
        } else {
            if (rafLoopId) {
                cancelAnimationFrame(rafLoopId);
                rafLoopId = null;
            }
            set([]);
        }
    });

    return {
        subscribe,
        set,
        start: async (idleId) => {
            const socket = get(socketStore);
            socket.emit(IdleClientEvent.START, { idleId: idleId });
        },
        stop: async (idleId) => {
            const socket = get(socketStore);
            socket.emit(IdleClientEvent.STOP, { idleId: idleId });
        },
    };
}

export const idleStore = createIdleStore();
