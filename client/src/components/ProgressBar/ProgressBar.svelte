<script>
    import { tweened } from "svelte/motion";
    import { expoOut, linear } from "svelte/easing";
    import { onMount } from "svelte";

    let { duration, repeat } = $props();
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
