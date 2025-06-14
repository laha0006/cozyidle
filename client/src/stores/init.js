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
        const ping = await getFetchWithRefresh("/api/now");
        const clientNow = Date.now();
        const latency = (clientNow - preFetchTime) / 2;
        console.log("init diff", ping.now + latency - clientNow);
        const idleData = await getFetchWithRefresh(`api/users/${userId}/idles`);
        console.log("CLIENT NOW:", clientNow);
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
            const serverTime = Math.floor(+idle.now_unix);
            const timeDiff = serverTime - clientNow;
            const clientAdjustTime = clientNow - (serverTime - startedTime);
            const diff = Number(idle.diff);
            return {
                ...idle,
                lastIncrement: Date.now() - diff,
                offset: timeDiff,
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

        console.log("idles:", idles);
        idleStore.set(idles);
        idleStore.loop();
    }
});
