<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";

    import { user, refreshUser } from "../../stores/userStore.js";

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
