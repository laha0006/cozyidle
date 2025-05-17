<script>
    import { Router, Route } from "svelte-tiny-router";
    import Test from "./components/Test.svelte";
    import NavBar from "./components/NavBar.svelte";

    function isAuthenticated() {
        return false;
    }

    const authGuard = async ({ to, from, next }) => {
        console.log("from:", from.path);
        console.log("to:", to.path);
        if (to.path.startsWith("/test") && !isAuthenticated()) {
            console.log("uh oh redirect to login!");
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
    <Route path="/test/:id" component={Test} />
</Router>

<style>
</style>
