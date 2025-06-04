<script>
    import { onMount } from "svelte";
    import { getFetchWithRefresh } from "../../util/fetch";
    import { user } from "../../stores/userStore.js";

    $effect(async () => {
        if ($user) {
            const init = await getFetchWithRefresh(
                "/api/users/" + $user.id + "/idles"
            );
            console.log("init: ", init);
        }
    });
</script>

<h1>IdleOverview</h1>
