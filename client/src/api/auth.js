import { user } from "../stores/userStore.js";
import { postFetch } from "../util/fetch";

export async function signup(formData) {
    const { response, json } = await postFetch("/api/signup", formData);
    if (!response.ok) {
        //TODO: toast
        return;
    }
    user.set(json.user);
}
