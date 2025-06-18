<script>
    import { navigate } from "svelte-tiny-router";
    import { postFetch } from "../../util/fetch";
    import { login } from "../../api/auth.js";
    import { toast } from "@zerodevx/svelte-toast";
    import { success } from "../../util/toasts.js";
    import { error } from "../../util/toasts.js";
    import { user } from "../../stores/userStore";
    import { Link } from "svelte-routing";
    import Button from "../Button/Button.svelte";
    let formData = {
        username: "",
        password: "",
    };

    let showPasswordChecked = false;

    async function handleLogin(e) {
        e.preventDefault();
        try {
            const json = await login(formData);
            navigate("/game");
            user.set(json.user);
            success("Sucesffuly logged in!");
        } catch (error) {
            error(error.message);
        }
    }
</script>

<div class="flex justify-center">
    <form class="bg-popover rounded border-border border-1 p-2">
        <div class="flex justify-center">
            <h3 class="text-xl">Login</h3>
        </div>
        <div class="flex flex-col text-center">
            <label for="username">Username</label>
            <input
                class="caret-white bg-muted rounded focus:outline-none pl-1"
                id="username"
                name="username"
                type="text"
                bind:value={formData.username}
            />
        </div>
        <div class="flex flex-col text-center">
            <label for="password">Password</label>
            <input
                class="caret-white bg-muted rounded focus:outline-none pl-1"
                id="password"
                name="password"
                type={showPasswordChecked ? "text" : "password"}
                bind:value={formData.password}
            />
            <label for="showPassword" class="text-sm">
                <input
                    type="checkbox"
                    id="showPassword"
                    bind:checked={showPasswordChecked}
                />
                Show password</label
            >
        </div>
        <div class="flex flex-col items-center justify-center">
            <Button type="primary" onclick={handleLogin}>Login</Button>
            <div class="flex mt-2 text-center justify-center text-sm">
                Do not have an account? &nbsp; <Link to="/signup">Sign Up</Link>
            </div>
        </div>
    </form>
</div>
