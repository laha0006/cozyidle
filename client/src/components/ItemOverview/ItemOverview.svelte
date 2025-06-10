<script>
    import { userItemStore } from "../../stores/userItemStore";
    import ItemCard from "./ItemCard.svelte";
</script>

{#each $userItemStore as item}
    <ItemCard {item} />
{/each}
