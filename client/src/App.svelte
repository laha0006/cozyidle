<script>
    import Test from "./components/Test.svelte";
    import NavBar from "./components/NavBar.svelte";
    import { Route, Router, Link } from "svelte-routing";
    import PrivateRoute from "./components/PrivateRoute/PrivateRoute.svelte";

    let url = $state("");
</script>

<main>
    <Router {url}>
        <nav>
            <Link to="/">Home</Link>
            <Link to="/private/10">Private</Link>
        </nav>
        <Route path="/">
            <h1>Home</h1>
        </Route>
        <PrivateRoute path="/private/:id" let:params>
            {#snippet content(params)}
                <Test name="Tolana" , age={20} {params} />
            {/snippet}
        </PrivateRoute>
    </Router>
</main>

<style>
</style>
