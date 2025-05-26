<script>
    //svelte imports
    import { onMount } from "svelte";

    //library imports
    import { Router, Route } from "svelte-tiny-router";
    import { SvelteToast } from "@zerodevx/svelte-toast";

    //other imports stores, util etc.
    import { user, setUserIfAuthenticated } from "./stores/userStore.js";

    //component imports
    import Test from "./components/Test.svelte";
    import NavBar from "./components/NavBar.svelte";
    import Login from "./components/Login/Login.svelte";
    import Signup from "./components/Signup/Signup.svelte";

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

    onMount(() => {
        setUserIfAuthenticated();
    });
</script>

<main class="bg-slate-900 text-white h-screen">
    <div class="text-center text-2xl font-bold">
        <SvelteToast
            options={{
                intro: {
                    y: -64,
                },
            }}
        />
    </div>
    <div class="flex justify-center text-2xl text-center flex-col">
        <Router beforeEach={guards}>
            <div>
                <NavBar />
            </div>
            <Route path="/">
                <h1 class="bg-test">Home</h1>
                {#if $user}
                    <h1>{$user.id}</h1>
                {:else}
                    <h1>No user</h1>
                {/if}
            </Route>
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/test/:id/:userId" component={Test} />
        </Router>
    </div>
</main>

<style>
</style>
