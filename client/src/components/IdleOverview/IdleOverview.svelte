<script>
    import { onMount } from "svelte";
    import { getFetchWithRefresh } from "../../util/fetch";
    import { user } from "../../stores/userStore.js";
    import IdleCard from "../IdleCard/IdleCard.svelte";
    import { idleStore } from "../../stores/idleStore.js";

    $effect(() => {
        // console.log($idleStore);
        // if ($idleStore) {
        // console.log($idleStore.length);
        // }
    });
</script>

<h1>IdleOverview</h1>
{#if $idleStore}
    <h1>IDLE STORE!</h1>
{/if}
<!-- {#each $idleStore as idle}
    {idle}
{/each} -->
{#if $idleStore && $idleStore.length > 0}
    {$idleStore[0].amount}
    <IdleCard progress={$idleStore[0].progress}></IdleCard>
{/if}
