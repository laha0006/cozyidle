<script>
    import { Router, Route } from "svelte-tiny-router";
    import Test from "./components/Test.svelte";
    import NavBar from "./components/NavBar.svelte";

    function isAuthenticated() {
        return true;
    }

    const authGuard = async ({ to, from, next }) => {
        if (to.path.startsWith("/test") && !isAuthenticated()) {
            //TODO: base64 encode from, is probably a good idea
            next({ path: `/?from=${to.path}`, replace: true });
        } else {
            next();
        }
    };

    const guards = [authGuard];
</script>

<Router beforeEach={guards}>
    <NavBar />
    <Route path="/">
        <h1>Home</h1>
    </Route>
    <Route path="/test/:id/:userId" component={Test} />
</Router>

<style>
</style>
