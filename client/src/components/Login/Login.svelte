<script>
    import { navigate } from "svelte-tiny-router";
    let formData = {
        username: "",
        password: "",
    };

    async function handleLogin(e) {
        e.preventDefault();

        navigate("/user");
    }
</script>

<div class="flex justify-center">
    <form class="bg-slate-900 rounded p-2">
        <div class="flex justify-center">
            <h3 class="text-xl">Login</h3>
        </div>
        <div class="flex flex-col text-center">
            <label for="username">Username</label>
            <input
                class="caret-white bg-slate-800 rounded focus:outline-none pl-1"
                id="username"
                name="username"
                type="text"
                bind:value={formData.username}
            />
        </div>
        <div class="flex flex-col text-center">
            <label for="password">Password</label>
            <input
                class="caret-white bg-slate-800 rounded focus:outline-none pl-1"
                id="password"
                name="password"
                type="password"
                bind:value={formData.password}
            />
        </div>
        <div class="flex justify-center">
            <button
                class="bg-green-800 text-black font-bold hover:cursor-pointer rounded py-1 px-2 mt-2"
                onclick={handleLogin}>Login</button
            >
        </div>
    </form>
</div>
