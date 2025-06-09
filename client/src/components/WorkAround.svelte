<script>
    import { onMount } from "svelte";
    import { setUserIfAuthenticated } from "../stores/userStore.js";
    import { idleStore } from "../stores/idleStore.js";
    import { socketStore } from "../stores/socketStore.js";
    import { itemStore } from "../stores/itemStore.js";

    $effect(() => {
        $socketStore, $idleStore;
    });

    onMount(() => {
        // console.log(">>>> WORK AROUND MOUNTED");
        setUserIfAuthenticated();
    });
</script>
