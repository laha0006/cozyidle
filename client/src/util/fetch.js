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
                console.log("refresh error");
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

export async function getFetchWithRefresh(url) {
    try {
        return await getFetch(url);
    } catch (error) {
        if (error.status === 401) {
            try {
                const json = await postFetch("/api/refresh");
                user.set(json.user);
            } catch (refreshError) {
                user.set(null);
                throw error;
            }
            return await getFetch(url);
        }
        throw error;
    }
}
