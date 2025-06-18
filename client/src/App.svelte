<script>
    import { onMount } from "svelte";

    // import { Router, Route } from "svelte-tiny-router";
    import { Router, Route } from "svelte-routing";
    import { SvelteToast } from "@zerodevx/svelte-toast";

    // import { authGuard } from "./util/guards.js";
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
    import LeaderboardOverview from "./components/Leaderboard/LeaderboardOverview.svelte";
    import PrivateRoute from "./components/PrivateRoute/PrivateRoute.svelte";
</script>

<div class="min-h-screen bg-background text-foreground">
    <div class="container mx-auto">
        <Router>
            <div
                class="flex flex-col bg-background text-foreground overflow-y-auto min-h-screen"
            >
                <header class="flex justify-center">
                    <NavBar />
                </header>
                <main class="flex grow bg-background text-foreground flex-col">
                    <div class="text-center text-2xl font-bold">
                        <SvelteToast
                            options={{
                                intro: {
                                    y: -64,
                                },
                            }}
                        />
                    </div>

                    <WorkAround />
                    <div class="flex justify-center text-2xl text-center">
                        <div></div>
                        <Route path="/">
                            <h1 class="">Home</h1>
                            {#if $user}
                                <h1>{$user.id}</h1>
                            {:else}
                                <h1>No user</h1>
                            {/if}
                        </Route>
                        <Route path="/login">
                            <Login />
                        </Route>
                        <Route path="/signup">
                            <Signup />
                        </Route>
                        <PrivateRoute path="/game">
                            <IdleOverview />
                        </PrivateRoute>
                        <PrivateRoute path="/item">
                            <ItemOverview />
                        </PrivateRoute>
                        <PrivateRoute path="/store">
                            <ItemStore />
                        </PrivateRoute>
                        <PrivateRoute path="/leaderboard">
                            <LeaderboardOverview />
                        </PrivateRoute>
                    </div>
                </main>
                <footer>
                    <div class="text-muted">
                        &copy; All rights reserved 2025
                    </div>
                </footer>
            </div>
        </Router>
    </div>
</div>

<style>
</style>
