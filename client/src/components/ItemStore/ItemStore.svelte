<script>
    import { userItemStore } from "../../stores/userItemStore.js";

    function buy(itemId) {
        userItemStore.buy(itemId);
    }
</script>

{#each $userItemStore as item}
    {#if !item.owned}
        <div>
            {item.name}
            {item.price}
        </div>
        <div>
            <button onclick={() => buy(item.item_id)}> buy </button>
        </div>
    {/if}
{/each}
