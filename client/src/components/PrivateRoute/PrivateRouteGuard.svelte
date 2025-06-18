<script>
    import { navigate } from "svelte-routing";
    import { user } from "../../stores/userStore.js";
    import { onMount } from "svelte";

    onMount(() => {
        if (!$user) {
            navigate("/login");
        }
    });
</script>

{#if $user}
    <slot />
{/if}
