<script>
    import { userItemStore } from "../../stores/userItemStore";
    import ItemCard from "./ItemCard.svelte";
    import SkillToggleBar from "../SkillToggleBar/SkillToggleBar.svelte";

    let filterId = $state(0);
    let level = $state(0);
    const filteredItems = $derived(
        $userItemStore?.filter(
            (item) => item.skillId === filterId && item.owned
        )
    );
    const ownedItems = $derived($userItemStore?.filter((item) => item.owned));

    function handleToggle(id) {
        filterId = id;
    }
</script>

<div class="flex flex-col justify-center items-center">
    <SkillToggleBar {filterId} onToggle={handleToggle} />
    <div class="flex flex-wrap gap-2">
        {#if filterId > 0}
            {#each filteredItems as item}
                <ItemCard {item} />
            {/each}
        {:else}
            {#each ownedItems as item}
                <ItemCard {item} />
            {/each}
        {/if}
    </div>
</div>
