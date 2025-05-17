<script>
    const { path, children } = $props();
    import { Route } from "svelte-routing";
    import PrivateRouteGuard from "./PrivateRouteGuard.svelte";
</script>

<Route {path} let:params>
    <PrivateRouteGuard>
        {@render children(params)}
    </PrivateRouteGuard>
</Route>
