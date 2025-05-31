<script>
    import { onMount } from "svelte";
    import { setUserIfAuthenticated } from "../stores/userStore.js";

    onMount(() => {
        // console.log(">>>> WORK AROUND MOUNTED");
        setUserIfAuthenticated();
    });
</script>
