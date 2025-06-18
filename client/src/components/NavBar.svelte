<script>
    import { useTinyRouter } from "svelte-tiny-router";
    import { toast } from "@zerodevx/svelte-toast";

    import { user } from "../stores/userStore.js";
    import { logout } from "../api/auth.js";
    import { success } from "../util/toasts.js";
    import { onMount } from "svelte";

    const router = useTinyRouter();
    const currentPath = $derived(router.fullPath);
    let menuOpen = $state(false);

    function toggleMenu() {
        menuOpen = !menuOpen;
    }

    function goToHome() {
        if (menuOpen) toggleMenu();
        router.navigate("/");
    }

    function goToLeaderboard() {
        if (menuOpen) toggleMenu();
        router.navigate("/leaderboard");
    }

    function goToGame() {
        if (menuOpen) toggleMenu();
        router.navigate("/game");
    }

    function goToLogin() {
        if (menuOpen) toggleMenu();
        router.navigate("/login");
    }

    function goToSignup() {
        if (menuOpen) toggleMenu();
        router.navigate("/signup");
    }

    function goToItem() {
        if (menuOpen) toggleMenu();
        router.navigate("/item");
    }

    function goToStore() {
        if (menuOpen) toggleMenu();
        router.navigate("/store");
    }

    async function handleLogout() {
        router.navigate("/");
        try {
            const json = await logout();
            if ($user) {
                user.set(null);
            }
            success(json.message);
        } catch (error) {
            toast.push(error.message);
        }
    }
</script>

<div class="container text-2xl">
    <div class="hidden md:block">
        <nav class="flex justify-between w-full mb-2">
            <div>
                <button onclick={goToHome}> LOGO </button>
            </div>

            {#if $user}
                <div class="flex gap-x-4 min-w-md justify-center">
                    <button
                        class={currentPath === "/game" ? "text-green-500" : ""}
                        onclick={goToGame}
                    >
                        Game</button
                    >

                    <button onclick={goToItem}>Item</button>
                    <button onclick={goToStore}>Store</button>
                    <button onclick={goToLeaderboard}>Leaderboards</button>
                </div>
                <div>
                    <button onclick={() => console.log("clicked!")}>
                        {$user.username}
                        {$user.id}
                    </button>
                    <button onclick={handleLogout}> Log out</button>
                </div>
            {:else}
                <div class="min-w-md"></div>
                <div>
                    <button onclick={goToLogin}> Login</button>
                    <button onclick={goToSignup}> Signup</button>
                </div>
            {/if}
        </nav>
    </div>
    <nav class="flex md:hidden justify-between w-full mb-2">
        <button onclick={goToHome}>LOGO</button>
        <button aria-label="Open menu" onclick={toggleMenu}>
            <i class="fa fa-bars"></i>
        </button>
    </nav>
    {#if menuOpen}
        <div class="fixed inset-0 bg-popover z-50">
            <div class="flex justify-end p-4">
                <button onclick={toggleMenu}>X</button>
            </div>
            <div class="flex items-start justify-center">
                {#if $user}
                    <div class="flex flex-col gap-y-1 justify-center">
                        <button
                            class={currentPath === "/game"
                                ? "text-green-500"
                                : ""}
                            onclick={goToGame}
                        >
                            Game</button
                        >

                        <button onclick={goToItem}>Item</button>
                        <button onclick={goToStore}>Store</button>
                        <button onclick={goToLeaderboard}>Leaderboards</button>
                        <button onclick={() => console.log("clicked!")}>
                            {$user.username}
                            {$user.id}
                        </button>
                        <button onclick={handleLogout}> Log out</button>
                    </div>
                {:else}
                    <div class="flex flex-col gap-1 justify-center">
                        <button onclick={goToLogin}> Login</button>
                        <button onclick={goToSignup}> Signup</button>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>
