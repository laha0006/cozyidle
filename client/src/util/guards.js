import { get } from "svelte/store";
import { user } from "../stores/userStore.js";
function isAuthenticated() {
    return get(user);
}

export const authGuard = async ({ to, from, next }) => {
    if (to.path.startsWith("/game") && !isAuthenticated()) {
        //TODO: base64 encode from, is probably a good idea
        next({ path: `/login?from=${to.path}`, replace: true });
    } else {
        next();
    }
};
