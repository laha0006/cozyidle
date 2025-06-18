<script>
    const { path, children } = $props();
    import { Route, navigate } from "svelte-routing";
    import PrivateRouteGuard from "./PrivateRouteGuard.svelte";
    import { onMount } from "svelte";
    import { user } from "../../stores/userStore.js";
</script>

<Route {path} let:params>
    <PrivateRouteGuard>
        <slot {params} />
    </PrivateRouteGuard>
</Route>
