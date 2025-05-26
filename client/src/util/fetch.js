//TODO: implement fetch methods
import { user } from "../stores/userStore.js";

export async function postFetch(url, data) {
    console.log("DATA", data);
    let response = await fetch(url, {
        credentials: "include",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        if (await refreshFetch()) {
            response = await postFetch(url, data);
        } else {
            const json = await response.json();
            console.log(json.message);
            return false;
        }
    }
    const json = await response.json();
    console.log(json.message);
    return json;
}

export async function getFetch(url) {
    let response = await fetch(url, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        if (await refreshFetch()) {
            response = await getFetch(url);
        } else {
            const json = await response.json();
            console.log(json.message);
            return false;
        }
    }
    const json = await response.json();
    console.log(json.message);
    return json;
}

export async function refreshFetch() {
    console.log("refreshFetch!");
    const response = await fetch("/api/refresh", {
        credentials: "include",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        user.set(null);
        return false;
    }
    const json = await response.json();
    user.set(json.user);
    return true;
}
