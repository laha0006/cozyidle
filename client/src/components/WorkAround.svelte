<script>
    import { onMount } from "svelte";
    import { setUserIfAuthenticated } from "../stores/userStore.js";
    import { socketStore } from "../stores/socketStore.js";
    import { itemsStore } from "../stores/itemsStore.js";

    onMount(() => {
        setUserIfAuthenticated();
    });
</script>
