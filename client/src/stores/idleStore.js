import { derived, get, writable } from "svelte/store";
import { user } from "./userStore.js";
import { getFetchWithRefresh } from "../util/fetch.js";
import { socketStore } from "./socketStore.js";
import { userSkillsStore } from "./userSkillsStore.js";
import { userResourcesStore } from "./userResourcesStore.js";

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
    let lastLoop;

    function loop() {
        update((idles) => {
            return idles.map((idle) => {
                const resourceId = idle.resource_id;
                if (!idle.active) {
                    return idle;
                } else {
                    const now = Date.now();
                    // const now = Date.now() + idle.offset;
                    const speed = idle.speed * 1000;
                    const progress = Math.min(
                        (now - idle.lastIncrement) / speed,
                        1
                    );
                    const incrementCount = Math.floor(
                        (now - idle.lastIncrement) / speed
                    );
                    if (incrementCount > 0) {
                        console.log(">now :", now);
                        console.log(">linc:", idle.lastIncrement);
                    }

                    if (incrementCount > 0 && userSkillsStore) {
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
                            idle.lastIncrement + incrementCount * speed,
                        progress: progress,
                        og: incrementCount > 0 ? Date.now() : idle.og,
                    };
                }
            });
        });

        rafLoopId = requestAnimationFrame(loop);
    }

    const socketUnsub = socketStore.subscribe(async ($socketStore) => {
        if ($socketStore) {
            $socketStore.on(IdleServerEvent.INIT, (data) => {
                const clientNow = Date.now();
                const {
                    idleId,
                    resourceId,
                    resource_amount,
                    started,
                    server_now,
                    diff,
                } = data;
                const startedTime = Math.floor(+started);
                const serverNow = Math.floor(+server_now);
                const offset = server_now - clientNow;
                console.log("diff:", typeof diff);
                console.log("diff:", +diff);
                const now = Date.now();
                console.log("now :", now);
                console.log("linc:", now + +diff);
                update((idles) => {
                    return idles.map((idle) => {
                        if (idle.idle_id !== idleId) return idle;
                        return {
                            ...idle,
                            active: true,
                            lastIncrement: Date.now(),
                            offset,
                        };
                    });
                });
            });

            $socketStore.on(IdleServerEvent.STOPPED, (data) => {
                const { idleId, resourceId, resource_amount } = data;
                userResourcesStore.setResource(resourceId, resource_amount);
                console.log("stop:", Date.now());
                update((idles) => {
                    return idles.map((idle) => {
                        if (idle.idle_id !== idleId) return idle;
                        console.log(">> stopped started:", idle.started);
                        console.log("soff:", Date.now() + idle.offset);
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
            const store = get(idleStore);
            const idle = store.find((idle) => idle.idle_id === idleId);
            const startedTime = Math.floor(+idle.started);
            socket.emit(IdleClientEvent.STOP, { idleId: idleId });
        },
    };
}

export const idleStore = createIdleStore();
export const idleBySkillStore = derived(idleStore, ($idleStore, set) => {
    const idlesBySkill = [];
    $idleStore.forEach((idle) => {
        const skill = idle.skill_id;
        if (!idlesBySkill[skill - 1]) {
            idlesBySkill[skill - 1] = [idle];
        } else {
            idlesBySkill[skill - 1].push(idle);
        }
    });
    set(idlesBySkill);
});
