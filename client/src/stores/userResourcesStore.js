import { get, writable } from "svelte/store";
import { user } from "./userStore";
import { getFetchWithRefresh } from "../util/fetch";
console.log("resources script");

function createUserResourcesStore() {
    const { set, update, subscribe } = writable(null);

    user.subscribe(async ($user) => {
        if ($user) {
            const result = await getFetchWithRefresh(
                "/api/users/" + $user.id + "/resources"
            );
            const resources = result.data;
            console.log("resources:", resources);
            set(resources);
        }
    });

    return {
        subscribe,
        set,
    };
}

export const userResourcesStore = createUserResourcesStore();
