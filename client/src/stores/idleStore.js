import { derived, get, writable } from "svelte/store";
import { user } from "./userStore.js";
import { getFetchWithRefresh } from "../util/fetch.js";

console.log("idleStore script");

function createIdleStore() {
    const { subscribe, set, update } = writable([]);

    let rafLoopId;

    function loop() {
        update((idles) => {
            return idles.map((idle) => {
                const now = Date.now();
                const progress = Math.min((now - idle.lastIncrement) / 2000, 1);
                const incrementCount = Math.floor(
                    (now - idle.lastIncrement) / 2000
                );
                return {
                    ...idle,
                    amount: idle.amount + incrementCount,
                    lastIncrement: idle.lastIncrement + incrementCount * 2000,
                    progress,
                };
            });
        });
        rafLoopId = requestAnimationFrame(loop);
    }

    let userUnsub = user.subscribe(async ($user) => {
        if ($user) {
            const init = await getFetchWithRefresh(
                "/api/users/" + $user.id + "/idles"
            );
            const actives = init.data
                .filter((idle) => idle.active)
                .map((idle) => ({
                    ...idle,
                    lastIncrement: Date.now(),
                    progress: 0,
                }));
            set(actives);
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
    };
}

// user.subscribe(async ($user) => {
//     if ($user) {
//         console.log("idleStore init");
//         const init = await getFetchWithRefresh(
//             "/api/users/" + $user.id + "/idles"
//         );
//         console.log("init:", init);
//         const actives = init.data
//             .filter((idle) => idle.active)
//             .map((idle) => {
//                 idle.lastIncrement = Date.now();
//                 return idle;
//             });

//         const { subscribe, set, update } = writable(null);
//         set(actives);
//         idleStore = {
//             subscribe,
//             set,
//         };
//         console.log("idleStore set!");
//         console.log(get(idleStore));
//         // idleStore.set(actives);
//         // loop();
//     }
// });

export const idleStore = createIdleStore();
// export const idleStore = writable(null);
