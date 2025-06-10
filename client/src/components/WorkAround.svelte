<script>
    import { onMount } from "svelte";
    import { setUserIfAuthenticated } from "../stores/userStore.js";
    import { idleStore } from "../stores/idleStore.js";
    import { socketStore } from "../stores/socketStore.js";
    import { userItemStore } from "../stores/userItemStore.js";
    import { itemsStore, unownedItems } from "../stores/itemsStore.js";

    onMount(() => {
        // console.log(">>>> WORK AROUND MOUNTED");
        $socketStore, $idleStore, $userItemStore, $itemsStore, $unownedItems;
        setUserIfAuthenticated();
    });
</script>
