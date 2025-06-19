<script>
    import { userItemStore } from "../../stores/userItemStore.js";
    import Button from "../Button/Button.svelte";
    const { item } = $props();
    function unequip() {
        userItemStore.unquip(item.itemId);
    }

    function equip() {
        userItemStore.equip(item.itemId);
    }
</script>

<div
    class="flex p-4 flex-col justify-center items-center min-w-50 {item.equipped
        ? 'border-green-500'
        : 'border-border'} border-1 rounded-2xl bg-card"
>
    <h3>{item.name}</h3>
    <div class="flex justify-between items-center p-2">
        <div class="flex flex-col justify-center items-center w-20">
            <div>bonus</div>
            <div>
                {item.bonus}
            </div>
        </div>
    </div>
    <div>
        {#if item.equipped}
            <Button type="primary" onclick={unequip}>Unequip</Button>
        {:else}
            <Button type="primary" onclick={equip}>Equip</Button>
        {/if}
    </div>
</div>
