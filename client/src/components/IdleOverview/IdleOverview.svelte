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
{#each $idleStore as idle}
    {#if idle.active}
        <IdleCard {idle} />
    {/if}
{/each}
