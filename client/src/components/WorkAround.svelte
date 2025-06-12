<script>
    import { onMount } from "svelte";
    import { setUserIfAuthenticated } from "../stores/userStore.js";
    import { socketStore } from "../stores/socketStore.js";
    import { itemsStore } from "../stores/itemsStore.js";
    import { allUserStoresReady } from "../stores/init.js";
    let init = false;
    allUserStoresReady.subscribe(($ready) => {
        if ($ready && !init) {
            console.log(">>>>> All stores are ready!");
            init = true;
        }
    });

    onMount(() => {
        setUserIfAuthenticated();
    });
</script>
