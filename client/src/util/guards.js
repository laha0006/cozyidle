import { get } from "svelte/store";
import { user } from "../stores/userStore.js";
console.log("guard script");
function isAuthenticated() {
    return get(user);
}

export const authGuard = async ({ to, from, next }) => {
    console.log("GUARD!");
    if (to.path.startsWith("/game") && !isAuthenticated()) {
        //TODO: base64 encode from, is probably a good idea
        console.log("guard");
        next({ path: `/login?from=${to.path}`, replace: true });
    } else {
        console.log("else");
        next();
    }
};
