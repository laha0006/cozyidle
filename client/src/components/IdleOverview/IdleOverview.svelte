<script>
    import { onMount } from "svelte";
    import { getFetchWithRefresh } from "../../util/fetch";
    import { user } from "../../stores/userStore.js";
    import IdleCard from "../IdleCard/IdleCard.svelte";
    import { idleStore } from "../../stores/idleStore.js";

    function test() {
        idleStore.start(100);
    }

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
    <button onclick={test}>test</button>
{/if}
{#each $idleStore as idle}
    {#if idle.active}
        {idle.amount}
        <IdleCard progress={idle.progress} />
    {/if}
{/each}
