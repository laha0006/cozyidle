<script>
    import { navigate } from "svelte-routing";
    import { setUserIfAuthenticated, user } from "../../stores/userStore.js";
    import { onMount } from "svelte";

    onMount(async () => {
        if (!$user) {
            await setUserIfAuthenticated();
            if (!$user) {
                navigate("/login");
            }
        }
    });
</script>

{#if $user}
    <slot />
{/if}
