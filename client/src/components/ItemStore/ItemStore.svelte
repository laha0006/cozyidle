<script>
    import { onMount } from "svelte";
    import { userItemStore } from "../../stores/userItemStore.js";
    import { userSkillsStore } from "../../stores/userSkillsStore.js";
    import ItemCard from "../ItemStore/ItemCard.svelte";
    import SkillToggleBar from "../SkillToggleBar/SkillToggleBar.svelte";

    let filterId = $state(0);
    const filteredItems = $derived(
        $userItemStore?.filter(
            (item) => item.skillId === filterId && !item.owned
        )
    );
    const unownedItems = $derived(
        $userItemStore?.filter((item) => !item.owned)
    );

    function filterBySkill(skillId) {
        filterId = skillId;
    }

    function buy(itemId) {
        userItemStore.buy(itemId);
    }
</script>

<div class="flex flex-col justify-center items-center">
    <SkillToggleBar {filterId} onToggle={filterBySkill} />
    <div class="flex flex-wrap items-center justify-center gap-2">
        {#if filterId > 0}
            {#each filteredItems as item}
                <ItemCard {item} onBuy={() => buy(item.itemId)} />
            {/each}
        {:else}
            {#each unownedItems as item}
                <ItemCard {item} onBuy={() => buy(item.itemId)} />
            {/each}
        {/if}
    </div>
</div>
