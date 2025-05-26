import { toast } from "@zerodevx/svelte-toast";

export const success = (m) =>
    toast.push(m, {
        theme: {
            "--toastBackground": "darkgreen",
            "--toastColor": "white",
            "--toastBarBackground": "green",
        },
        duration: 2000,
    });
