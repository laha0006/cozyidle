<script>
    import { onMount } from "svelte";
    import { userItemStore } from "../../stores/userItemStore.js";
    import { userSkillsStore } from "../../stores/userSkillsStore.js";
    import ItemCard from "../ItemStore/ItemCard.svelte";

    let filterId = $state(1);
    const filteredItems = $derived(
        $userItemStore?.filter((item) => item.skill_id === filterId)
    );

    function filterBySkill(skillId) {
        filterId = skillId;
    }

    function buy(itemId) {
        console.log("buy!", itemId);
        userItemStore.buy(itemId);
    }
</script>

<div class="">
    <div
        class="flex gap-5 mb-5 p-1 justify-center items-center bg-card border-border border-1"
    >
        {#each $userSkillsStore as skill}
            <button
                class="{filterId === skill.id
                    ? 'border-border bg-muted'
                    : 'border-transparent'} border-2 p-1"
                onclick={() => filterBySkill(skill.id)}
            >
                {skill.name}
            </button>
        {/each}
    </div>
    <div class="flex items-center justify-center">
        {#each filteredItems as item}
            {#if !item.owned}
                <ItemCard {item} onBuy={() => buy(item.item_id)} />
            {/if}
        {/each}
    </div>
</div>
