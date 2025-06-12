import { get, writable } from "svelte/store";
import {
    postFetch,
    postFetchWithRefresh,
    getFetchWithRefresh,
} from "../util/fetch.js";
console.log("user store script");

export const user = writable(null);

export async function setUserIfAuthenticated() {
    console.log("set user");
    try {
        const json = await getFetchWithRefresh("/api/users");
        if (!get(user)) {
            user.set(json.user);
        }
    } catch (error) {
        user.set(null);
    }
}

export async function refreshUser() {
    try {
        const json = await postFetch("/api/refresh");
        user.set(json.user);
    } catch (error) {
        user.set(null);
    }
}
