import { derived } from "svelte/store";
import { idleStore } from "./idleStore";
import { userItemStore } from "./userItemStore";
import { userSkillsStore } from "./userSkillsStore";
import { userResourcesStore } from "./userResourcesStore";
import { getFetchWithRefresh } from "../util/fetch.js";
import { user } from "./userStore.js";
import { getLevel } from "../util/skillLevel.js";

user.subscribe(async ($user) => {
    if ($user) {
        const userId = $user.id;

        const preFetchTime = Date.now();
        const idleData = await getFetchWithRefresh(`api/users/${userId}/idles`);
        const clientNow = Date.now();
        const latency = (clientNow - preFetchTime) / 2;
        console.log("Latency:", latency);

        const resourcesPromise = getFetchWithRefresh(
            `api/users/${userId}/resources`
        );
        const skillsPromise = getFetchWithRefresh(`api/users/${userId}/skills`);
        const itemsPromise = getFetchWithRefresh(`api/users/${userId}/items`);

        const [resourcesData, skillsData, itemsdata] = await Promise.all([
            resourcesPromise,
            skillsPromise,
            itemsPromise,
        ]);

        const idles = idleData.data.map((idle) => {
            const startedTime = Math.floor(+idle.started);
            const serverNow = Math.floor(+idle.now_unix);
            const timeDiff = serverNow - clientNow;
            const clientAdjustTime = startedTime - (timeDiff - latency);

            // Debug logging
            if (idle.idle_id === 1) {
                console.log("=== TIME CALCULATION DEBUG ===");
                console.log("startedTime (server):", startedTime);
                console.log("serverNow:", serverNow);
                console.log("clientNow:", clientNow);
                console.log("timeDiff (server-client):", timeDiff);
                console.log("latency:", latency);
                console.log("clientAdjustTime:", clientAdjustTime);
                console.log(
                    "Time since start (client calc):",
                    Date.now() - clientAdjustTime
                );
                console.log("Speed (ms):", idle.speed * 1000);
                console.log("===============================");
            }

            return {
                ...idle,
                lastIncrement: clientAdjustTime,
                progress: 0,
            };
        });

        const resources = resourcesData.data;
        const resourceMap = new Map();
        resources.forEach((r) => {
            if (resourceMap.get(r.id)) return;
            resourceMap.set(r.id, { amount: r.amount, name: r.name });
        });
        userResourcesStore.set(resourceMap);

        const skills = skillsData.data;
        const skillsWithLevels = skills.map((skill) => {
            return {
                ...skill,
                level: getLevel(skill.id, skill.experience),
            };
        });
        userSkillsStore.set(skillsWithLevels);

        const items = itemsdata.data;
        userItemStore.set(items);

        idleStore.set(idles);
        idleStore.loop();
    }
});
