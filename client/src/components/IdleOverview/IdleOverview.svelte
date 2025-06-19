<script>
    import { idleBySkillStore } from "../../stores/idleStore.js";

    import IdleCard from "../IdleCard/IdleCard.svelte";
    import SkillIdlesCard from "../IdleCard/SkillIdlesCard.svelte";
</script>

<div class="flex justify-center">
    <div
        class="relative items-start grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4"
    >
        {#if $idleBySkillStore}
            {#each $idleBySkillStore as idles, index}
                <SkillIdlesCard {idles} />
            {/each}
        {/if}
    </div>
</div>
