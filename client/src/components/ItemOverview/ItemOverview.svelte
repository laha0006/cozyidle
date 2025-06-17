<script>
    import { userItemStore } from "../../stores/userItemStore";
    import ItemCard from "./ItemCard.svelte";
    import SkillToggleBar from "../SkillToggleBar/SkillToggleBar.svelte";

    let filterId = $state(1);
    const filteredItems = $derived(
        $userItemStore?.filter(
            (item) => item.skill_id === filterId && item.owned
        )
    );

    function handleToggle(id) {
        filterId = id;
    }
</script>

<SkillToggleBar {filterId} onToggle={handleToggle} />
{#each filteredItems as item}
    <ItemCard {item} />
{/each}
