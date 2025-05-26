import { writable } from "svelte/store";
import {
    postFetch,
    postFetchWithRefresh,
    getFetchWithRefresh,
} from "../util/fetch";

export const user = writable(null);
checkAuth();

async function checkAuth() {
    try {
        const json = await getFetchWithRefresh("api/users");
        console.log("JSON:", json);
        user.set(json.user);
    } catch (error) {
        console.log(error.message);
    }
}
