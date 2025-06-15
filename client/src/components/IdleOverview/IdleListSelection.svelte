<script>
    import IdleCard from "../IdleCard/IdleCard.svelte";

    const { idles } = $props();
    let selected = $state(0);
    let viewList = $state(false);

    function select(index) {
        selected = index;
        toggleList();
    }

    function toggleList() {
        console.log("view list clicked!");
        viewList = !viewList;
    }
</script>

{#if viewList}
    {#each idles as idle, index}
        <button onclick={() => select(index)}> {idle.idle}</button>
    {/each}
{:else}
    <IdleCard idle={idles[selected]} />
    <div>
        <button onclick={toggleList}>Select</button>
    </div>
{/if}
