<script>
    const { active, cooldown, onStart, onStop } = $props();
</script>

{#if cooldown}
    {#if active}
        <button class=""><i class="fa-solid fa-stop text-gray-400"></i></button>
    {:else}
        <button class=""><i class="fa-solid fa-play text-gray-400"></i></button>
    {/if}
{:else if active}
    <button class="" onclick={onStop}><i class="fa-solid fa-stop"></i></button>
{:else}
    <button class="" onclick={onStart}><i class="fa-solid fa-play"></i></button>
{/if}
