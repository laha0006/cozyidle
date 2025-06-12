import { get, writable } from "svelte/store";
import { user } from "./userStore.js";
import { getFetchWithRefresh } from "../util/fetch";
import { getLevel } from "../util/skillLevel.js";

console.log("user Skills store script");

function createUserSkillsStore() {
    const { set, update, subscribe } = writable(null);

    user.subscribe(async ($user) => {
        if ($user) {
            const res = await getFetchWithRefresh(
                "/api/users/" + $user.id + "/skills"
            );
            const skills = res.data;
            const skillsWithLevels = skills.map((skill) => {
                return {
                    ...skill,
                    level: getLevel(skill.id, skill.experience),
                };
            });
            set(skillsWithLevels);
        }
    });

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
