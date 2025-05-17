<script>
    let user = $state(null);
    user = "Test";
</script>

{#if user}
    <slot />
{/if}
