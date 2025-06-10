import { derived, writable } from "svelte/store";
import { getFetchWithRefresh } from "../util/fetch";
import { userItemStore } from "./userItemStore.js";

export const itemsStore = writable(null);

const items = await getFetchWithRefresh("/api/items");
itemsStore.set(items.data);

console.log("all items:", items.data);

export const unownedItems = derived(
    [itemsStore, userItemStore],
    ([$itemsStore, $userItemStore], set) => {
        if ($itemsStore && $userItemStore) {
            console.log("both!");
            const unownedItems = $itemsStore.filter((item) => {
                return !$userItemStore.some(
                    (userItem) => userItem.item_id === item.item_id
                );
            });
            set(unownedItems);
            console.log("unowned:", unownedItems);
        }
    }
);
