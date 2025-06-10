<script>
    import { unownedItems } from "../../stores/itemsStore.js";
</script>

{#each $unownedItems as item}
    <div>
        {item.name}
        {item.price}
    </div>
    <div>
        <button> buy </button>
    </div>
{/each}
