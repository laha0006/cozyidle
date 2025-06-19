import { get, writable } from "svelte/store";

import { user } from "./userStore.js";
import { getFetchWithRefresh } from "../util/fetch";
import { getLevel } from "../util/skillLevel.js";

function createUserSkillsStore() {
    const { set, update, subscribe } = writable(null);

    return {
        subscribe,
        set,
        giveExperience: (skillId, amount) => {
            update((skills) => {
                return skills.map((skill) => {
                    if (skill.id !== skillId) return skill;
                    const newExperience = skill.experience + amount;
                    return {
                        ...skill,
                        experience: newExperience,
                        level: getLevel(skill.id, newExperience),
                    };
                });
            });
            const skills = get(userSkillsStore);
        },
    };
}

export const userSkillsStore = createUserSkillsStore();
