<script>
    import { onMount } from "svelte";

    import { Link, navigate } from "svelte-routing";
    import { toast } from "@zerodevx/svelte-toast";

    import { user } from "../../stores/userStore.js";
    import { logout } from "../../api/auth.js";
    import { success } from "../../util/toasts.js";

    import logo from "../../assets/logo.png";

    import NavItem from "./NavItem.svelte";
    import Button from "../Button/Button.svelte";

    let menuOpen = $state(false);

    function toggleMenu() {
        menuOpen = !menuOpen;
    }

    async function handleLogout() {
        navigate("/login");
        try {
            const json = await logout();
            if ($user) {
                user.set(null);
            }
            success(json.message);
        } catch (error) {
            error("something went wrong!");
        }
    }
</script>

<div class="container text-2xl mt-2">
    <div class="hidden md:block">
        <nav class="flex justify-between w-full mb-2">
            <div>
                <Link to="/"
                    ><img
                        src={logo}
                        alt="logo showing the text CozyIdle"
                        class="logo"
                    /></Link
                >
            </div>

            {#if $user}
                <div class="flex gap-x-4 min-w-md justify-center">
                    <Link to="/game/idles" let:active>
                        <NavItem text="Idles" {active} />
                    </Link>
                    <Link to="/game/equipment" let:active>
                        <NavItem text="Equipment" {active} />
                    </Link>
                    <Link to="/game/store" let:active>
                        <NavItem text="Store" {active} />
                    </Link>
                    <Link to="/game/leaderboard" let:active>
                        <NavItem text="Leaderboards" {active} />
                    </Link>
                    <Link to="/game/resources" let:active>
                        <NavItem text="Resources" {active} />
                    </Link>
                </div>
                <div class="flex gap-4">
                    <button
                        onclick={() => {
                            navigate("/game/profile/" + $user.id);
                        }}
                    >
                        {$user.username}
                    </button>
                    <Button type="danger" onclick={handleLogout}>
                        Log out</Button
                    >
                </div>
            {:else}
                <div class="min-w-md"></div>
                <div>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Signup</Link>
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
                        <Link to="/game/idles" let:active onclick={toggleMenu}>
                            <NavItem text="Idles" {active} />
                        </Link>
                        <Link
                            to="/game/equipment"
                            let:active
                            onclick={toggleMenu}
                        >
                            <NavItem text="Equipment" {active} />
                        </Link>
                        <Link to="/game/store" let:active onclick={toggleMenu}>
                            <NavItem text="Store" {active} />
                        </Link>
                        <Link
                            to="/game/leaderboard"
                            let:active
                            onclick={toggleMenu}
                        >
                            <NavItem text="Leaderboards" {active} />
                        </Link>
                        <Link
                            to="/game/resources"
                            let:active
                            onclick={toggleMenu}
                        >
                            <NavItem text="Resources" {active} />
                        </Link>
                        <button
                            onclick={() => {
                                toggleMenu();
                                navigate("/game/profile/" + $user.id);
                            }}
                        >
                            {$user.username}
                        </button>
                        <Button type="danger" onclick={handleLogout}>
                            Log out</Button
                        >
                    </div>
                {:else}
                    <div class="flex flex-col gap-1 justify-center">
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>

<style>
    .logo {
        height: 58px;
        width: auto;
    }
</style>
