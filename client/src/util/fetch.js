//TODO: implement fetch methods
import { user } from "../stores/userStore.js";

export async function postFetch(url, data) {
    const response = await fetch(url, {
        credentials: "include",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    console.log("RESPONSE:", response);

    const json = await response.json();
    return json;
}

export async function postFetchWithRefresh(url, data) {
    let response = await postFetch(url, data);
    if (response.status === 401) {
        if (await refreshFetch()) {
            response = await postFetch(url, data);
        } else {
            const json = await response.json();
            console.log(json.message);
            return false;
        }
    }
    const json = await response.json();
    return json;
}

export async function getFetch(url) {
    const response = await fetch(url, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const json = await response.json();
    return json;
}

export async function getFetchWithRefresh(url) {
    let response = await getFetch(url);
    if (response.status === 401) {
        if (await refreshFetch()) {
            response = await getFetch(url);
        } else {
            const json = await response.json();
            return false;
        }
    }
    const json = await response.json();
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
