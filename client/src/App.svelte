<script>
    import { onMount } from "svelte";

    import { Router, Route } from "svelte-tiny-router";
    import { SvelteToast } from "@zerodevx/svelte-toast";

    import { authGuard } from "./util/guards.js";
    import { user, setUserIfAuthenticated } from "./stores/userStore.js";
    import "./stores/init.js";

    import Test from "./components/Test.svelte";
    import NavBar from "./components/NavBar.svelte";
    import Login from "./components/Login/Login.svelte";
    import Signup from "./components/Signup/Signup.svelte";
    import ProgressBar from "./components/ProgressBar/ProgressBar.svelte";
    import IdleCard from "./components/IdleCard/IdleCard.svelte";
    import WorkAround from "./components/WorkAround.svelte";
    import IdleOverview from "./components/IdleOverview/IdleOverview.svelte";
    import ItemOverview from "./components/ItemOverview/ItemOverview.svelte";
    import ItemStore from "./components/ItemStore/ItemStore.svelte";

    const guards = [authGuard];
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

    <Router beforeEach={guards}>
        <WorkAround />
        <div class="flex justify-center text-2xl text-center flex-col">
            <div>
                <NavBar />
            </div>
            <Route path="/">
                <h1 class="">Home</h1>
                {#if $user}
                    <h1>{$user.id}</h1>
                {:else}
                    <h1>No user</h1>
                {/if}
            </Route>
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/game" component={IdleOverview} />
            <Route path="/item" component={ItemOverview} />
            <Route path="/store" component={ItemStore} />
        </div>
    </Router>
</main>

<style>
</style>
