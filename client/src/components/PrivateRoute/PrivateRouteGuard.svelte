<script>
    import { navigate } from "svelte-routing";
    import {
        refreshUser,
        setUserIfAuthenticated,
        user,
    } from "../../stores/userStore.js";
    import { onMount } from "svelte";

    onMount(async () => {
        setTimeout(async () => {
            if (!$user) {
                await refreshUser();
                if (!$user) {
                    navigate("/login");
                }
            }
        }, 100);
    });
</script>

{#if $user}
    <slot />
{/if}
