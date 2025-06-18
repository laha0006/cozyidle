<script>
    import { onMount } from "svelte";

    import { Router, Route } from "svelte-tiny-router";
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
    // async function authGuard({ to, from, next }) {
    //     console.log("GUARD!");
    //     if (to.path.startsWith("/game") && !isAuthenticated()) {
    //         //TODO: base64 encode from, is probably a good idea
    //         console.log("guard");
    //         next({ path: `/login?from=${to.path}`, replace: true });
    //     } else {
    //         console.log("else");
    //         next();
    //     }
    // }
    console.log("before guard");
    const authGuard = async ({ to, from, next }) => {
        console.log(
            "[authGuard] Navigating from:",
            from?.path,
            "to:",
            to.path,
            "Query:",
            to.query
        );
        if (to.path.startsWith("/admin") && !isAuthenticated()) {
            console.log(
                "Authentication required for admin route, redirecting to login."
            );
            // Redirect to login page, replacing the current history entry
            next({ path: "/login", replace: true });
        } else {
            // Continue navigation
            next();
        }
    };
    const guards = [authGuard];
</script>

<div class="min-h-screen bg-background text-foreground">
    <div class="container mx-auto">
        <Router beforeEach={guards}>
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
                        <Route path="/login" component={Login} />
                        <Route path="/signup" component={Signup} />
                        <Route path="/game" component={IdleOverview} />
                        <Route path="/item" component={ItemOverview} />
                        <Route path="/store" component={ItemStore} />
                        <Route
                            path="/leaderboard"
                            component={LeaderboardOverview}
                        />
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
