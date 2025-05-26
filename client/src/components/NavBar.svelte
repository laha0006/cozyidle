<script>
    import { useTinyRouter } from "svelte-tiny-router";
    import { user } from "../stores/userStore.js";
    const router = useTinyRouter();

    function goToHome() {
        router.navigate("/");
    }

    function goToTest() {
        router.navigate("/test/10/420");
    }

    function goToLogin() {
        router.navigate("/login");
    }

    function goToSignup() {
        router.navigate("/signup");
    }
</script>

<button onclick={goToHome}> Home</button>
<button onclick={goToTest}> Test</button>
{#if !$user}
    <button onclick={goToLogin}> Login</button>
    <button onclick={goToSignup}> Signup</button>
{/if}
