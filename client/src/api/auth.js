import { user } from "../stores/userStore.js";
import { postFetch } from "../util/fetch";

export async function signup(formData) {
    return await postFetch("/api/signup", formData);
}

export async function login(formData) {
    const { response, json } = await postFetch("/api/login", formData);
}
