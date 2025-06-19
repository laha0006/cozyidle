import { get, writable } from "svelte/store";
import {
    postFetch,
    postFetchWithRefresh,
    getFetchWithRefresh,
} from "../util/fetch.js";

export const user = writable(null);

export async function setUserIfAuthenticated() {
    await refreshUser();
}

export async function refreshUser() {
    try {
        const json = await postFetch("/api/refresh");
        if (!get(user)) {
            user.set(json.user);
        }
    } catch (error) {
        user.set(null);
    }
}
