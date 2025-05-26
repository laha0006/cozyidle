<script>
    import { useTinyRouter } from "svelte-tiny-router";
    import { user } from "../stores/userStore.js";
    import { logout } from "../api/auth.js";
    import { toast } from "@zerodevx/svelte-toast";
    import { success } from "../util/toasts.js";
    const router = useTinyRouter();

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

    async function handleLogout() {
        try {
            const json = await logout();
            user.set(null);
            success(json.message);
        } catch (error) {
            toast.push(error.message);
        }
    }
</script>

<button onclick={goToHome}> Home</button>
<button onclick={goToGame}> Game</button>
{#if !$user}
    <button onclick={goToLogin}> Login</button>
    <button onclick={goToSignup}> Signup</button>
{:else}
    <button onclick={handleLogout}> Log out</button>
    {$user.id}
{/if}
