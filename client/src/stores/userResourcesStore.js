import { get, writable } from "svelte/store";
import { user } from "./userStore";
import { getFetchWithRefresh } from "../util/fetch";

function createUserResourcesStore() {
    const { set, update, subscribe } = writable(null);

    return {
        subscribe,
        set,
        setResource: (resourceId, amount) => {
            update((resources) => {
                const newMap = new Map(resources);
                const resource = resources.get(resourceId);
                const updatedResource = {
                    ...resource,
                    amount: amount,
                };
                newMap.set(resourceId, updatedResource);
                return newMap;
            });
        },
        add: (resourceId, amount) => {
            // console.log(">>> add <<<");
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
