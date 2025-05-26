import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [svelte(), tailwindcss()],
    server: {
        proxy: {
            // Proxy all requests starting with /api to your Express server
            "/api": {
                target: "http://localhost:8080",
                changeOrigin: true,
            },
        },
    },
});
