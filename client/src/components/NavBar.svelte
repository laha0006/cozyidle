<script>
    import { useTinyRouter } from "svelte-tiny-router";
    import { toast } from "@zerodevx/svelte-toast";

    import { user } from "../stores/userStore.js";
    import { logout } from "../api/auth.js";
    import { success } from "../util/toasts.js";
    import { onMount } from "svelte";

    const router = useTinyRouter();

    const currentPath = $derived(router.fullPath);

    function goToHome() {
        router.navigate("/");
    }

    function goToGame() {
        router.navigate("/game");
    }

    function goToLogin() {
        router.navigate("/login");
    }

    function goToSignup() {
        router.navigate("/signup");
    }

    function goToItem() {
        router.navigate("/item");
    }

    function goToStore() {
        router.navigate("/store");
    }

    async function handleLogout() {
        router.navigate("/");
        try {
            const json = await logout();
            if ($user) {
                user.set(null);
            }
            success(json.message);
        } catch (error) {
            toast.push(error.message);
        }
    }
</script>

<button onclick={goToHome}> Home</button>
<button
    class={currentPath === "/game" ? "text-green-500" : ""}
    onclick={goToGame}
>
    Game</button
>
<button onclick={goToItem}>Item</button>
<button onclick={goToStore}>Store</button>
{#if $user}
    <button onclick={handleLogout}> Log out</button>
    {$user.id}
{:else}
    <button onclick={goToLogin}> Login</button>
    <button onclick={goToSignup}> Signup</button>
{/if}
