<script>
    import { tweened } from "svelte/motion";
    import { expoOut, linear } from "svelte/easing";
    import { onMount } from "svelte";

    let { duration, repeat } = $props();
    console.log("init duration: ", duration);
    const progress = tweened(0, { duration: duration, easing: linear });

    function reset() {
        progress.set(0, { duration: 0 });
        progress.set(1, { duration: duration });
    }

    function start() {
        progress.set(1, { duration: duration });
    }

    $effect(() => {
        if (repeat) {
            console.log("duration:", duration);
            console.log("repeat", repeat);
            console.log("effect start");
            start();
        } else {
            progress.set(0, { duration: 0 });
        }
    });

    onMount(() => {
        const unsubscribe = progress.subscribe((value) => {
            if (value === 1) {
                // onTick();
            }
            if (value === 1 && repeat) {
                console.log("reset");
                reset();
            }
            if (value === 1 && !repeat) {
                progress.set(0, { duration: 0 });
            }
        });
        return () => {
            unsubscribe();
        };
    });
</script>

<div>
    <progress value={$progress}></progress>
</div>
