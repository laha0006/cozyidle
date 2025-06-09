import { writable } from "svelte/store";
import { user } from "./userStore.js";
import { socketStore } from "./socketStore.js";
import { getFetchWithRefresh } from "../util/fetch";

function createItemStore() {
    const { subscribe, set, update } = writable([]);

    const userUnsub = user.subscribe(async ($user) => {
        if ($user) {
            const userItems = await getFetchWithRefresh(
                "/api/users/" + $user.id + "/items"
            );
            set(userItems);
            console.log("items:", userItems);
        }
    });

    return {
        subscribe,
        set,
    };
}

export const itemStore = createItemStore();
