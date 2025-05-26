import { user } from "../stores/userStore.js";

function isAuthenticated() {
    return Boolean($user);
}

export const authGuard = async ({ to, from, next }) => {
    if (to.path.startsWith("/game") && !isAuthenticated()) {
        //TODO: base64 encode from, is probably a good idea
        next({ path: `/?from=${to.path}`, replace: true });
    } else {
        next();
    }
};
