<script>
    import { postFetch } from "../../util/fetch.js";

    let formData = {
        username: "",
        email: "",
        password: "",
    };

    let showPasswordChecked = false;

    async function signup(e) {
        e.preventDefault();
        console.log(formData);
        const json = await postFetch("/api/signup", formData);
        console.log("after postFetch");
        console.log(json.message);
    }
</script>

<div class="flex justify-center">
    <form class="bg-slate-900 rounded p-2">
        <div class="flex justify-center">
            <h3 class="text-xl">Sign up</h3>
        </div>
        <div class="flex flex-col text-center">
            <label for="username">Username</label>
            <input
                bind:value={formData.username}
                class="caret-white bg-slate-800 rounded focus:outline-none pl-1"
                id="username"
                name="username"
                type="text"
            />
        </div>
        <div class="flex flex-col text-center">
            <label for="email">Email</label>
            <input
                bind:value={formData.email}
                class="caret-white bg-slate-800 rounded focus:outline-none pl-1"
                id="email"
                name="email"
                type="email"
            />
        </div>
        <div class="flex flex-col text-center">
            <label for="password">Password</label>
            <input
                bind:value={formData.password}
                class="caret-white bg-slate-800 rounded focus:outline-none pl-1"
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
        <div class="flex justify-center">
            <button
                onclick={signup}
                class="bg-green-800 text-black font-bold rounded py-1 px-2"
                >Sign up</button
            >
        </div>
    </form>
</div>
