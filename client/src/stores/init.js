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

        const idlePromise = getFetchWithRefresh(`api/users/${userId}/idles`);
        const resourcesPromise = getFetchWithRefresh(
            `api/users/${userId}/resources`
        );
        const skillsPromise = getFetchWithRefresh(`api/users/${userId}/skills`);
        const itemsPromise = getFetchWithRefresh(`api/users/${userId}/items`);

        const preFetchTime = Date.now();
        const [idleData, resourcesData, skillsData, itemsdata] =
            await Promise.all([
                idlePromise,
                resourcesPromise,
                skillsPromise,
                itemsPromise,
            ]);

        const clientNow = Date.now();
        const latency = clientNow - preFetchTime;

        const idles = idleData.data.map((idle) => {
            const startedTime = Math.floor(+idle.started);
            const serverNow = Math.floor(+idle.now_unix);
            const timeDiff = serverNow - clientNow;
            console.log("time diff:", timeDiff);
            const clientAdjustTime = startedTime - (timeDiff + latency);
            return {
                ...idle,
                lastIncrement: clientAdjustTime,
            };
        });
        idleStore.set(idles);

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

        idleStore.loop();

        console.log("Latency:", latency);
    }
});
