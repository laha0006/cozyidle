import { derived } from "svelte/store";
import { idleStore } from "./idleStore";
import { userItemStore } from "./userItemStore";
import { userSkillsStore } from "./userSkillsStore";
import { userResourcesStore } from "./userResourcesStore";

export const allUserStoresReady = derived(
    [idleStore, userItemStore, userSkillsStore, userResourcesStore],
    ([$idle, $item, $skill, $resource], set) => {
        const ready = $idle && $item && $skill && $resource;
        set(ready);
    }
);
