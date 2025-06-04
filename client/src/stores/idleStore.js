import { derived, get, writable } from "svelte/store";
import { user } from "./userStore.js";
import { getFetchWithRefresh } from "../util/fetch.js";
import { socketStore } from "./socketStore.js";

console.log("idleStore script");

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
                    const progress = Math.min(
                        (now - idle.lastIncrement) / 2000,
                        1
                    );
                    const incrementCount = Math.floor(
                        (now - idle.lastIncrement) / 2000
                    );
                    resources.set(resourceId, resource + incrementCount);
                    return {
                        ...idle,
                        amount: resource + incrementCount,
                        lastIncrement:
                            idle.lastIncrement + incrementCount * 2000,
                        progress,
                    };
                }
            });
        });
        rafLoopId = requestAnimationFrame(loop);
    }

    let socketUnsub = socketStore.subscribe(async ($socketStore) => {
        if ($socketStore) {
            console.log("SOCKET STORE IN IDLE STORE INIT <<<");
            $socketStore.on(IdleServerEvent.INIT, (data) => {
                const { idleId, resourceId, resource_amount } = data;
                resources.set(resourceId, resource_amount);
            });

            $socketStore.on(IdleServerEvent.STOPPED, (data) => {
                console.log("stopped:", data);
                const { idleId, resourceId, resource_amount } = data;
                resources.set(resourceId, resource_amount);
            });
        }
    });

    let userUnsub = user.subscribe(async ($user) => {
        if ($user) {
            const init = await getFetchWithRefresh(
                "/api/users/" + $user.id + "/idles"
            );
            const idles = init.data.map((idle) => ({
                ...idle,
                lastIncrement: Date.now(),
                progress: 0,
            }));
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
            console.log("idle start:", idleId);
            const socket = get(socketStore);
            socket.emit(IdleClientEvent.START, { idleId: idleId });
            update((idles) => {
                return idles.map((idle) => {
                    if (idle.idle_id !== idleId) return idle;
                    console.log("update local from start");
                    return {
                        ...idle,
                        started: Date.now(),
                        active: true,
                        lastIncrement: Date.now(),
                    };
                });
            });
        },
        stop: async (idleId) => {
            console.log("idle stop:", idleId);
            const socket = get(socketStore);
            socket.emit(IdleClientEvent.STOP, { idleId: idleId });
            update((idles) => {
                return idles.map((idle) => {
                    if (idle.idle_id !== idleId) return idle;
                    console.log("idle:", idle);
                    return { ...idle, active: false, progress: 0 };
                });
            });
        },
    };
}

export const idleStore = createIdleStore();
