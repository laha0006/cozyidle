<script>
    import { Link } from "svelte-routing";

    import { signup } from "../../api/auth.js";
    import { postFetch } from "../../util/fetch.js";
    import { error, success } from "../../util/toasts.js";
    import { user } from "../../stores/userStore.js";

    import Button from "../Button/Button.svelte";

    let formData = {
        username: "",
        email: "",
        password: "",
    };

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    let showPasswordChecked = false;

    async function handleSignup(e) {
        e.preventDefault();
        if (formData.username.length < 3) {
            error("Username must be at least 3 characters long.");
            return;
        }
        if (formData.password.length < 6) {
            error("Password must be at least 6 characters long.");
            return;
        }
        if (!isValidEmail(formData.email)) {
            error("Please enter a valid email address.");
            return;
        }
        try {
            const json = await signup(formData);
            user.set(json.user);
            success(json.message);
        } catch (err) {
            console.log(err);
            error("something went wrong!");
        }
    }
</script>

<div class="flex justify-center">
    <form class="bg-popover border-border border-1 rounded p-2">
        <div class="flex justify-center">
            <h3 class="text-xl">Sign up</h3>
        </div>
        <div class="flex flex-col text-center">
            <label for="username">Username</label>
            <input
                bind:value={formData.username}
                class="caret-white bg-muted rounded focus:outline-none pl-1"
                id="username"
                name="username"
                type="text"
            />
        </div>
        <div class="flex flex-col text-center">
            <label for="email">Email</label>
            <input
                bind:value={formData.email}
                class="caret-white bg-muted rounded focus:outline-none pl-1"
                id="email"
                name="email"
                type="email"
            />
        </div>
        <div class="flex flex-col text-center">
            <label for="password">Password</label>
            <input
                bind:value={formData.password}
                class="caret-white bg-muted rounded focus:outline-none pl-1"
                id="password"
                name="password"
                type={showPasswordChecked ? "text" : "password"}
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
            <Button onclick={handleSignup}>Sign up</Button>
            <div class="flex mt-2 text-center justify-center text-sm">
                Do not have an account? &nbsp; <Link to="/login">Login</Link>
            </div>
        </div>
    </form>
</div>
