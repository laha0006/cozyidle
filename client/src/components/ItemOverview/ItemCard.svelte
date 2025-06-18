<script>
    import { userItemStore } from "../../stores/userItemStore.js";
    const { item } = $props();
    function unequip() {
        userItemStore.unquip(item.itemId);
    }

    function equip() {
        userItemStore.equip(item.itemId);
    }
</script>

<div
    class="flex p-4 flex-col justify-center items-center {item.equipped
        ? 'border-green-500'
        : 'border-border'} border-1 rounded-2xl bg-card"
>
    <h3>{item.name}</h3>
    <div>
        {#if item.equipped}
            <button onclick={unequip}>unequip</button>
        {:else}
            <button onclick={equip}> equip </button>
        {/if}
    </div>
</div>
