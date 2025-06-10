<script>
    import { userItemStore } from "../../stores/userItemStore.js";
    const { item } = $props();
    function unequip() {
        console.log("itemId:", item.item_id);
        userItemStore.unquip(item.item_id);
    }

    function equip() {
        userItemStore.equip(item.item_id);
    }
</script>

<h3>{item.name}</h3>
<div>
    {#if item.equipped}
        <button onclick={unequip}>unequip</button>
    {:else}
        <button onclick={equip}> equip </button>
    {/if}
</div>
