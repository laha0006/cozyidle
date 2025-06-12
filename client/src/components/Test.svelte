<script>
    import { onMount } from "svelte";
    import { socketStore } from "../stores/socketStore.js";
    // const { name, age, id, userId } = $props();
    console.log("test script");

    onMount(() => {
        console.log(location);
    });
</script>

<h1>GAME</h1>
{$socketStore}
