import { get, writable } from "svelte/store";
import { user } from "./userStore";
import { getFetchWithRefresh } from "../util/fetch";
import { socketStore } from "./socketStore";

export const ResourceClientEvent = Object.freeze({
    SELL: "resource:client:sell",
});

export const ResourceServerEvent = Object.freeze({
    SOLD: "resource:server:sold",
});

function createUserResourcesStore() {
    const { set, update, subscribe } = writable(null);

    function deduct(resourceId, amount) {
        update((resources) => {
            const newMap = new Map(resources);
            const resource = resources.get(resourceId);
            const updatedResource = {
                ...resource,
                amount: resource.amount - amount,
            };
            newMap.set(resourceId, updatedResource);
            return newMap;
        });
    }

    function setResource(resourceId, amount) {
        update((resources) => {
            const newMap = new Map(resources);
            const resource = resources.get(resourceId);
            if (amount < resource.amount) {
                console.log(">>> DECREMENT <<<");
            }
            const updatedResource = {
                ...resource,
                amount: amount,
            };
            newMap.set(resourceId, updatedResource);
            return newMap;
        });
    }

    socketStore.subscribe(($socket) => {
        if ($socket) {
            $socket.on(ResourceServerEvent.SOLD, (data) => {
                const { gold, resourceId, amount } = data;
                deduct(resourceId, amount);
                setResource(4, gold);
            });
        }
    });

    return {
        subscribe,
        set,
        setResource: setResource,
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
        deduct: deduct,
        sell: (resourceId, amount) => {
            console.log("sell!");
            const socket = get(socketStore);
            socket.emit(ResourceClientEvent.SELL, { resourceId, amount });
        },
    };
}

export const userResourcesStore = createUserResourcesStore();
