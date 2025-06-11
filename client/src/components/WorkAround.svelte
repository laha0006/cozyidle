<script>
    import { onMount } from "svelte";
    import { setUserIfAuthenticated } from "../stores/userStore.js";
    import { idleStore } from "../stores/idleStore.js";
    import { socketStore } from "../stores/socketStore.js";
    import { userItemStore } from "../stores/userItemStore.js";
    import { itemsStore } from "../stores/itemsStore.js";
    import { userSkillsStore } from "../stores/userSkillsStore.js";
    import { userResourcesStore } from "../stores/userResourcesStore.js";

    onMount(() => {
        setUserIfAuthenticated();
        $socketStore,
            $idleStore,
            $userItemStore,
            $itemsStore,
            $userSkillsStore,
            $userResourcesStore;
    });
</script>
