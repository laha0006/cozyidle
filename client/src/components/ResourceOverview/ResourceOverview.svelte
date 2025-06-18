<script>
    import { userResourcesStore } from "../../stores/userResourcesStore.js";
    import ResourceCard from "./ResourceCard.svelte";

    const goldResource = $derived($userResourcesStore?.get(4));
</script>

<div>
    Gold: {goldResource?.amount}
</div>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
    {#each $userResourcesStore?.entries() as [resourceId, resource]}
        {#if resourceId !== 4}
            <ResourceCard {resourceId} {resource} />
        {/if}
    {/each}
</div>
