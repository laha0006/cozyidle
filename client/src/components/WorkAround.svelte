<script>
    import { onMount } from "svelte";
    import { setUserIfAuthenticated } from "../stores/userStore.js";
    import { idleStore } from "../stores/idleStore.js";
    import { socketStore } from "../stores/socketStore.js";
    import { userItemStore } from "../stores/userItemStore.js";
    import { itemsStore } from "../stores/itemsStore.js";

    onMount(() => {
        $socketStore, $idleStore, $userItemStore, $itemsStore;
        setUserIfAuthenticated();
    });
</script>
