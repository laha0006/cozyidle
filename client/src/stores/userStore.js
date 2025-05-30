import { writable } from "svelte/store";
import {
    postFetch,
    postFetchWithRefresh,
    getFetchWithRefresh,
} from "../util/fetch";

export const user = writable(null);

export async function setUserIfAuthenticated() {
    try {
        const json = await getFetchWithRefresh("api/users");
        user.set(json.user);
    } catch (error) {
        console.log(error.message);
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
// user.subscribe((value) => {
//     console.log("changed value:", value);
// });
