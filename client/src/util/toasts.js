import { toast } from "@zerodevx/svelte-toast";

export const success = (m) =>
    toast.push(m, {
        theme: {
            "--toastBackground": "darkgreen",
            "--toastColor": "white",
            "--toastBarBackground": "green",
            "--toastBarHeight": 0,
        },
        duration: 1200,
    });

export const error = (m) =>
    toast.push(m, {
        theme: {
            "--toastBackground": "red",
            "--toastColor": "white",
            "--toastBarBackground": "orange",
            "--toastBarHeight": 0,
        },
        duration: 1200,
    });
