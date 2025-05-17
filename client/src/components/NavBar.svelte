<script>
    import { useTinyRouter } from "svelte-tiny-router";
    const router = useTinyRouter();

    function goToHome() {
        router.navigate("/");
    }

    function goToTest() {
        router.navigate("/test/10");
    }
</script>

<button onclick={goToHome}> Home</button>
<button onclick={goToTest}> Test</button>
