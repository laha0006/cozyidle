import { get, writable } from "svelte/store";
import {
    postFetch,
    postFetchWithRefresh,
    getFetchWithRefresh,
} from "../util/fetch.js";

export const user = writable(null);

export async function setUserIfAuthenticated() {
    console.log("calling set user!");
    await refreshUser();
    // try {
    //     const json = await getFetchWithRefresh("/api/users");
    //     if (!get(user)) {
    //         user.set(json.user);
    //     }
    // } catch (error) {
    //     user.set(null);
    // }
}

export async function refreshUser() {
    try {
        const json = await postFetch("/api/refresh");
        console.log("before check");
        if (!get(user)) {
            console.log("in check");
            user.set(json.user);
        }
    } catch (error) {
        user.set(null);
    }
}
