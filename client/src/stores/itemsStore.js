import { derived, writable } from "svelte/store";
import { getFetchWithRefresh } from "../util/fetch";
import { userItemStore } from "./userItemStore.js";
console.log("items store script");

export const itemsStore = writable(null);

const items = await getFetchWithRefresh("/api/items");
itemsStore.set(items.data);
