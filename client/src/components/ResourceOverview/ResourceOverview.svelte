<script>
    import { userResourcesStore } from "../../stores/userResourcesStore.js";
    import SkillToggleBar from "../SkillToggleBar/SkillToggleBar.svelte";
    import ResourceCard from "./ResourceCard.svelte";

    const goldResource = $derived($userResourcesStore?.get(1));

    let filterId = $state(0);

    const filteredResources = $derived(
        $userResourcesStore
            ?.entries()
            .map((id, resource) => {
                return { id, ...resource };
            })
            .filter((resource) => resource.id === filterId)
    );
    $inspect(filteredResources);

    function handleToggle(id) {
        filterId = id;
    }
</script>

<div>
    <SkillToggleBar {filterId} onToggle={handleToggle} />
</div>
<div>
    Gold: {goldResource?.amount}
</div>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
    {#if filterId > 0}
        {#each $userResourcesStore?.entries() as [resourceId, resource]}
            {#if resourceId !== 1 && resource.skillId === filterId}
                <ResourceCard {resourceId} {resource} />
            {/if}
        {/each}
    {:else}
        {#each $userResourcesStore?.entries() as [resourceId, resource]}
            {#if resourceId !== 1}
                <ResourceCard {resourceId} {resource} />
            {/if}
        {/each}
    {/if}
</div>
