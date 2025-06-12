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
            const resourceMap = new Map();
            resources.forEach((r) => {
                if (resourceMap.get(r.id)) return;
                resourceMap.set(r.id, { amount: r.amount, name: r.name });
            });
            set(resourceMap);
        }
    });

    return {
        subscribe,
        set,
        add: (resourceId, amount) => {
            update((resources) => {
                const newMap = new Map(resources);
                const resource = resources.get(resourceId);
                const updatedResource = {
                    ...resource,
                    amount: resource.amount + amount,
                };
                newMap.set(resourceId, updatedResource);
                return newMap;
            });
        },
    };
}

export const userResourcesStore = createUserResourcesStore();
