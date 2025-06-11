import { get, writable } from "svelte/store";
import { user } from "./userStore.js";
import { getFetchWithRefresh } from "../util/fetch";
import { getLevel } from "../util/skillLevel.js";

function createUserSkillsStore() {
    const { set, update, subscribe } = writable(null);

    user.subscribe(async ($user) => {
        if ($user) {
            console.log("init skills store");
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
                console.log("skills: ", skills);
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
            console.log("UPDATED:", skills);
        },
    };
}

export const userSkillsStore = createUserSkillsStore();
