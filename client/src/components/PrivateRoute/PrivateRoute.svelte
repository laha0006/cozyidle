<script>
    const { path, content } = $props();
    import { Route } from "svelte-routing";
    import PrivateRouteGuard from "./PrivateRouteGuard.svelte";
</script>

<Route {path} let:params>
    <PrivateRouteGuard>
        {@render content(params)}
    </PrivateRouteGuard>
</Route>
