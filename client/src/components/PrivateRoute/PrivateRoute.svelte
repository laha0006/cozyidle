<script>
    import { Route, navigate } from "svelte-routing";

    import PrivateRouteGuard from "./PrivateRouteGuard.svelte";

    const { path } = $props();
</script>

<Route {path} let:params>
    <PrivateRouteGuard>
        <slot {params} />
    </PrivateRouteGuard>
</Route>
