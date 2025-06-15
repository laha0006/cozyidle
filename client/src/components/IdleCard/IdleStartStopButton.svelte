<script>
    const { active, cooldown, onStart, onStop } = $props();
</script>

{#if cooldown}
    {#if active}
        <button class="text-red-600">Stop</button>
    {:else}
        <button class="text-red-600">Stop</button>
    {/if}
{:else if active}
    <button onclick={onStop}>Stop</button>
{:else}
    <button onclick={onStart}>Start</button>
{/if}
