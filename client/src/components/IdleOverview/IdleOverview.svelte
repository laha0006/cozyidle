<script>
    import { onMount } from "svelte";
    import { getFetchWithRefresh } from "../../util/fetch";
    import { user } from "../../stores/userStore.js";
    import IdleCard from "../IdleCard/IdleCard.svelte";
    import { idleStore, idleBySkillStore } from "../../stores/idleStore.js";
    import SkillIdlesCard from "../IdleCard/SkillIdlesCard.svelte";
</script>

<div class="h-screen overflow-auto-y">
    <div class="flex justify-center">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {#if $idleBySkillStore}
                {#each $idleBySkillStore as idles}
                    <SkillIdlesCard {idles} />
                {/each}
            {/if}
        </div>
    </div>
</div>
<!-- {#if $idleStore}
    {#each $idleStore as idle}
        <IdleCard {idle} />
    {/each}
{/if} -->
