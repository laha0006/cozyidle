<script>
    import { onMount } from "svelte";

    import { Router, Route } from "svelte-tiny-router";
    import { SvelteToast } from "@zerodevx/svelte-toast";

    import { user, setUserIfAuthenticated } from "./stores/userStore.js";
    import { authGuard } from "./util/guards.js";

    import Test from "./components/Test.svelte";
    import NavBar from "./components/NavBar.svelte";
    import Login from "./components/Login/Login.svelte";
    import Signup from "./components/Signup/Signup.svelte";

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
            <Route path="/game" component={Test} />
        </Router>
    </div>
</main>

<style>
</style>
