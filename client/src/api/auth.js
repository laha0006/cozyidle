import { user } from "../stores/userStore.js";
import { postFetch } from "../util/fetch";

export async function signup(formData) {
    const { response, json } = await postFetch("/api/signup", formData);
    if (!response.ok) {
        return false;
    }
    user.set(json.user);
}

export async function login(formData) {
    const { response, json } = await postFetch("/api/login", formData);
}
