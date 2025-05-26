import { user } from "../stores/userStore.js";
import { postFetch } from "../util/fetch";

export async function signup(formData) {
    const { response, json } = await postFetch("/api/signup", formData);
    if (!response.ok) {
        //TODO: toast
        return;
    }
    console.log("succesfully signed up!");
    user.set(json.user);
}
