import { derived, get, writable } from "svelte/store";
import { user } from "./userStore.js";
import { getFetchWithRefresh } from "../util/fetch.js";
import { socketStore } from "./socketStore.js";
import { userSkillsStore } from "./userSkillsStore.js";
import { userResourcesStore } from "./userResourcesStore.js";

console.log("idle store script");

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
    let skillsReady = false;

    function loop() {
        update((idles) => {
            return idles.map((idle) => {
                const resourceId = idle.resource_id;
                if (!idle.active) {
                    return idle;
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

                    if (incrementCount > 0 && userSkillsStore) {
                        console.log("idle.lastIncrement", idle.lastIncrement);
                        console.log(
                            "math:",
                            idle.lastIncrement + incrementCount * speed
                        );
                        userSkillsStore.giveExperience(
                            idle.skill_id,
                            incrementCount * idle.increment
                        );
                    }
                    if (incrementCount > 0 && userResourcesStore) {
                        userResourcesStore.add(
                            resourceId,
                            incrementCount * idle.increment
                        );
                    }
                    return {
                        ...idle,
                        amount: idle.amount + incrementCount * idle.increment,
                        lastIncrement:
                            incrementCount > 0 ? now : idle.lastIncrement,
                        progress,
                    };
                }
            });
        });
        rafLoopId = requestAnimationFrame(loop);
    }

    const socketUnsub = socketStore.subscribe(async ($socketStore) => {
        if ($socketStore) {
            $socketStore.on(IdleServerEvent.INIT, (data) => {
                const { idleId, resourceId, resource_amount, started } = data;
                const startedTime = Math.floor(+started);
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
                console.log("amount:", resource_amount);
                userResourcesStore.setResource(resourceId, resource_amount);
                update((idles) => {
                    return idles.map((idle) => {
                        if (idle.idle_id !== idleId) return idle;
                        return { ...idle, active: false, progress: 0 };
                    });
                });
            });
        }
    });

    return {
        subscribe,
        set,
        loop: () => {
            loop();
        },
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
