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

    let json;
    try {
        json = await response.json();
    } catch {
        json = null;
    }

    if (!response.ok) {
        const error = new Error(json?.message || "Request failed");
        error.status = response.status;
        error.response = response;
        error.body = json;
        throw error;
    }

    return json;
}

export async function postFetchWithRefresh(url, data) {
    try {
        return await postFetch(url, data);
    } catch (error) {
        if (error.status === 401) {
            try {
                const json = await postFetch("/api/refresh");
                user.set(json.user);
            } catch (refreshError) {
                user.set(null);
                throw error;
            }
            return await postFetch(url, data);
        }
        throw error;
    }
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
