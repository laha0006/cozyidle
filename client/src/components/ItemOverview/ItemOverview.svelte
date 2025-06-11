<script>
    import { userItemStore } from "../../stores/userItemStore";
    import ItemCard from "./ItemCard.svelte";
</script>

<h1>USer items</h1>
{#each $userItemStore as item}
    {#if item.owned}
        <ItemCard {item} />
    {/if}
{/each}
