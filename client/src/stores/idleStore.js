import { derived, get, writable } from "svelte/store";
import { user } from "./userStore.js";
import { getFetchWithRefresh } from "../util/fetch.js";
import { socketStore } from "./socketStore.js";
import { userSkillsStore } from "./userSkillsStore.js";
import { userResourcesStore } from "./userResourcesStore.js";
import { upgradesStore } from "./upgradesStore.js";

export const IdleClientEvent = Object.freeze({
    START: "idle:client:start",
    STOP: "idle:client:stop",
    SYNC: "idle:client:sync",
    UPGRADE: "idle:client:upgrade",
    UNLOCK: "idle:client:unlock",
});

export const IdleServerEvent = Object.freeze({
    INIT: "idle:server:init",
    UPDATE: "idle:server:update",
    STOPPED: "idle:server:stopped",
    UPGRADED: "idle:server:upgraded",
    UNLOCKED: "idle:server:unlocked",
});

function createIdleStore() {
    const { subscribe, set, update } = writable([]);

    const resources = new Map();
    let rafLoopId;
    let skillsReady = false;
    let lastLoop = Date.now();
    let incNow;
    let startNow;

    function loop() {
        // if (Date.now() - lastLoop < 20) {
        //     rafLoopId = requestAnimationFrame(loop);
        //     return;
        // }
        update((idles) => {
            return idles.map((idle) => {
                const resourceId = idle.resourceId;
                if (!idle.active) {
                    return idle;
                } else {
                    const now = Date.now() + idle.offset;
                    const speed = idle.speed * 1000;

                    const progress = Math.min(
                        (now - idle.lastIncrement) / speed,
                        1
                    );
                    const incrementCount = Math.floor(
                        (now - idle.lastIncrement) / speed
                    );
                    if (incrementCount > 0 && userSkillsStore) {
                        userSkillsStore.giveExperience(
                            idle.skillId,
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
                    resourceAmount,
                    started,
                    serverNow,
                    diff,
                } = data;
                const startedTime = Math.floor(+started);
                const serverNowFloored = Math.floor(+serverNow);
                const offset = serverNowFloored - clientNow;
                update((idles) => {
                    return idles.map((idle) => {
                        if (idle.idleId !== idleId) return idle;
                        return {
                            ...idle,
                            active: true,
                            lastIncrement: startedTime,
                            offset,
                        };
                    });
                });
            });

            $socketStore.on(IdleServerEvent.STOPPED, (data) => {
                const { idleId, resourceId, resourceAmount } = data;
                userResourcesStore.setResource(resourceId, resourceAmount);
                update((idles) => {
                    return idles.map((idle) => {
                        if (idle.idleId !== idleId) return idle;
                        return { ...idle, active: false, progress: 0 };
                    });
                });
            });

            $socketStore.on(IdleServerEvent.UNLOCKED, (data) => {
                const { idleId, price } = data;
                console.log("unlocked data:", data);
                userResourcesStore.deduct(1, price);
                update((idles) => {
                    return idles.map((idle) => {
                        if (idle.idleId !== idleId) return idle;
                        return { ...idle, unlocked: true };
                    });
                });
            });

            $socketStore.on(IdleServerEvent.UPGRADED, (data) => {
                const { idleId, price } = data;
                console.log("UPGRADED:", data);
                userResourcesStore.deduct(1, price);
                idleStore.sync();
            });
        }
    });

    return {
        subscribe,
        set,
        loop: () => {
            loop();
        },
        sync: async () => {
            const preFetchTime = Date.now();
            const ping = await getFetchWithRefresh("/api/now");
            const clientNow = Date.now();
            const latency = (clientNow - preFetchTime) / 2;
            const theUser = get(user);
            const idleData = await getFetchWithRefresh(
                `/api/users/${theUser.id}/idles`
            );
            const newIdles = idleData.data.map((idle) => {
                if (!idle.active) return idle;
                const startedTime = Math.floor(+idle.started);
                const serverTime = Math.floor(+idle.nowUnix);
                const timeDiff = serverTime - clientNow;
                return {
                    ...idle,
                    lastIncrement: startedTime,
                    offset: timeDiff,
                };
            });
            set(newIdles);
        },
        start: async (idleId) => {
            const socket = get(socketStore);
            socket.emit(IdleClientEvent.START, { idleId: idleId });
        },
        stop: async (idleId) => {
            const socket = get(socketStore);
            const store = get(idleStore);
            const idle = store.find((idle) => idle.idleId === idleId);
            const startedTime = Math.floor(+idle.started);
            socket.emit(IdleClientEvent.STOP, { idleId: idleId });
        },
        buyUpgrade: async (upgradeId) => {
            const socket = get(socketStore);
            socket.emit(IdleClientEvent.UPGRADE, { upgradeId });
        },
        unlock: async (idleId) => {
            const socket = get(socketStore);
            socket.emit(IdleClientEvent.UNLOCK, { idleId });
        },
    };
}

export const idleStore = createIdleStore();
export const idleBySkillStore = derived(idleStore, ($idleStore, set) => {
    const idlesBySkill = [];
    $idleStore.forEach((idle) => {
        const index = idle.skillId - 2;
        if (!idlesBySkill[index]) {
            idlesBySkill[index] = [idle];
        } else {
            idlesBySkill[index].push(idle);
        }
    });
    set(idlesBySkill);
});
