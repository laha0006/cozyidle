import { user } from "../stores/userStore.js";
import { postFetch, postFetchWithRefresh } from "../util/fetch";

export async function signup(formData) {
    return await postFetch("/api/signup", formData);
}

export async function login(formData) {
    return await postFetch("/api/login", formData);
}

export async function logout() {
    return await postFetchWithRefresh("/api/logout");
}
