<script>
    import { onMount } from "svelte";
    import { getFetchWithRefresh } from "../../util/fetch";
    import { user } from "../../stores/userStore.js";
    import IdleCard from "../IdleCard/IdleCard.svelte";
    import { idleStore, idleBySkillStore } from "../../stores/idleStore.js";
</script>

<h1>IdleOverview</h1>
<!-- {#if $idleBySkillStore}
    {#each $idleBySkillStore as idles}
        <div>
            {idles[0].skill}
        </div>
        <div>
            <IdleCard idle={idles[0]} />
        </div>
    {/each}
{/if} -->

{#if $idleStore}
    {#each $idleStore as idle}
        <IdleCard {idle} />
    {/each}
{/if}
