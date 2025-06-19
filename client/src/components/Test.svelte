<script>
    import { onMount } from "svelte";
    import { socketStore } from "../stores/socketStore.js";
</script>

<h1>GAME</h1>
{$socketStore}
