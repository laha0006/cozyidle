import { derived } from "svelte/store";

import { idleStore } from "./idleStore";
import { userItemStore } from "./userItemStore";
import { userSkillsStore } from "./userSkillsStore";
import { userResourcesStore } from "./userResourcesStore";
import { getFetchWithRefresh } from "../util/fetch.js";
import { upgradesStore } from "./upgradesStore.js";
import { leaderboards } from "./leaderboardStore.js";
import { user } from "./userStore.js";
import { getLevel } from "../util/skillLevel.js";

user.subscribe(async ($user) => {
    if ($user) {
        const userId = $user.id;
        const preFetchTime = Date.now();
        const ping = await getFetchWithRefresh("/api/now");
        const clientNow = Date.now();
        const latency = (clientNow - preFetchTime) / 2;

        const idlePromise = getFetchWithRefresh(`/api/users/${userId}/idles`);
        const resourcesPromise = getFetchWithRefresh(
            `/api/users/${userId}/resources`
        );
        const skillsPromise = getFetchWithRefresh(
            `/api/users/${userId}/skills`
        );
        const itemsPromise = getFetchWithRefresh(`/api/users/${userId}/items`);
        const upgradesPromise = getFetchWithRefresh("/api/upgrades");

        const [idleData, resourcesData, skillsData, itemsdata, upgradesData] =
            await Promise.all([
                idlePromise,
                resourcesPromise,
                skillsPromise,
                itemsPromise,
                upgradesPromise,
            ]);

        const idles = idleData.data.map((idle) => {
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

        const resources = resourcesData.data;
        const resourceMap = new Map();
        resources.forEach((r) => {
            if (resourceMap.get(r.id)) return;
            resourceMap.set(r.id, r);
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

        const upgrades = upgradesData.data;
        const upgradeMap = new Map();
        upgrades.forEach((upgrade) => {
            const mapEntry = upgradeMap.get(upgrade.idleId);
            if (!mapEntry) {
                upgradeMap.set(upgrade.idleId, [upgrade]);
            } else {
                mapEntry.push(upgrade);
            }
        });
        upgradesStore.set(upgradeMap);

        idleStore.set(idles);
        idleStore.loop();
    }
});
