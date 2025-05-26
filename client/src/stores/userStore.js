import { writable } from "svelte/store";

export const user = writable(null);
checkAuthAndSetUser();

async function checkAuthAndSetUser() {
    console.log("checking Auth and Setting User Store.");
    let response = await fetch("/api/users", {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        response = await fetch("api/refresh ", {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            console.log("no valid refresh token.");
            return;
        }
    }
    const json = await response.json();
    user.set(json.user);
    console.log("user has been set!");
}
