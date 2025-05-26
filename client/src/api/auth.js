import { user } from "../stores/userStore.js";
import { postFetch } from "../util/fetch";

export async function signup(formData) {
    const json = await postFetch("/api/signup", formData);
    return json;
}

export async function login(formData) {
    const { response, json } = await postFetch("/api/login", formData);
}
