import { writable } from "svelte/store";
import { user } from "./userStore.js";
import { getFetchWithRefresh } from "../util/fetch";

function createUserSkillsStore() {
    const { set, update, subscribe } = writable(null);

    user.subscribe(async ($user) => {
        if ($user) {
            console.log("init skills store");
            const skills = await getFetchWithRefresh(
                "/api/users/" + $user.id + "/skills"
            );
            console.log("userSkills,", skills);
            set(skills);
        }
    });

    return {
        subscribe,
        set,
        giveExperience: (skillId, amount) => {
            console.log("gain!");
            update((skills) => {
                return skills.map((skill) => {
                    console.log("map!");
                    if (skill.id !== skillId) return skill;
                    return {
                        ...skill,
                        experience: experience + amount,
                    };
                });
            });
        },
    };
}

export const userSkillsStore = createUserSkillsStore();
