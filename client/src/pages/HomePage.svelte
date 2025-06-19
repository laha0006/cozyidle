<script>
    import { navigate } from "svelte-routing";
</script>

<div class="w-full bg-background flex flex-col">
    <div class="w-full py-16 bg-card">
        <h1
            class="text-9xl font-bold text-primary tracking-wide text-center w-full"
        >
            CozyIdle
        </h1>
        <p class="text-2xl text-muted-foreground text-center mt-4">
            A relaxing idle game to progress, grow, and unwind.
        </p>
    </div>
    <div class="flex flex-col items-center mt-16 space-y-8">
        <section>
            <h2 class="text-xl font-semibold text-primary text-center">
                Features
            </h2>
            <ul
                class="text-lg text-muted-foreground mt-2 space-y-1 text-center"
            >
                <li>Simple, calming gameplay</li>
                <li>Progress while you’re away</li>
                <li>Cozy, prgorammer visuals</li>
            </ul>
        </section>
        <section>
            <button
                class="px-8 py-3 bg-primary text-white rounded-lg text-xl hover:bg-primary/90 transition"
                onclick={() => navigate("/signup")}
            >
                Play Now
            </button>
        </section>
    </div>
</div>
