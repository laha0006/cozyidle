<script>
    import { onMount } from "svelte";
    import { getFetchWithRefresh } from "../../util/fetch";
    import { user } from "../../stores/userStore.js";
    import IdleCard from "../IdleCard/IdleCard.svelte";
    import { idleStore, idleBySkillStore } from "../../stores/idleStore.js";
    import IdleListSelection from "./IdleListSelection.svelte";
</script>

<h1>IdleOverview</h1>
{#if $idleBySkillStore}
    {#each $idleBySkillStore as idles}
        <IdleListSelection {idles} />
    {/each}
{/if}

<!-- {#if $idleStore}
    {#each $idleStore as idle}
        <IdleCard {idle} />
    {/each}
{/if} -->
