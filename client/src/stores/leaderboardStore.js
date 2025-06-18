import { writable } from "svelte/store";
import { userSkillsStore } from "./userSkillsStore";
import { getFetch } from "../util/fetch";

function createLeaderboardStore() {
    const { set, update, subscribe } = writable(null);

    userSkillsStore.subscribe(async ($skills) => {
        if ($skills) {
            const promises = [];
            $skills.forEach(async (skill) => {
                promises.push(
                    getFetch("/api/skills/" + skill.id + "/leaderboard")
                );
            });
            const data = await Promise.all(promises);
            const leaderboardMap = new Map();
            data.forEach((leaderboard, index) => {
                leaderboardMap.set(index + 2, leaderboard.data); // + 2 because, first relevant skill is skill_id = 2
            });
            set(leaderboardMap);
        }
    });

    return {
        subscribe,
        set,
    };
}

export const leaderboards = createLeaderboardStore();
