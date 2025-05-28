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
    import { socketStore } from "./stores/socketStore.js";
    import ProgressBar from "./components/ProgressBar/ProgressBar.svelte";

    const guards = [authGuard];

    // $effect(() => {
    //     if ($user) {
    //         initSocket();
    //     } else {
    //         disconnectSocket();
    //     }
    // });

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
                <h1 class="">Home</h1>
                {#if $socketStore}
                    <h1>Derived yay</h1>
                {/if}
                {#if $user}
                    <h1>{$user.id}</h1>
                {:else}
                    <h1>No user</h1>
                {/if}
                {$socketStore}
            </Route>
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/game" component={ProgressBar} />
        </Router>
    </div>
</main>

<style>
</style>
