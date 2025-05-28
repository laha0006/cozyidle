<script>
    import { tweened } from "svelte/motion";
    import { linear } from "svelte/easing";
    import { onMount } from "svelte";

    const { duration } = $props();

    let repeat = true;
    let count = 0;

    const progress = tweened(0, { duration: 2000, easing: linear });

    function reset() {
        count++;
        if (count === 5) {
            repeat = false;
        }
        progress.set(0, { duration: 0 });
        progress.set(1);
    }

    function start() {
        progress.set(1);
    }

    onMount(() => {
        start();
        const unsubscribe = progress.subscribe((value) => {
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
    <h1>ProgressBar</h1>
    <progress value={$progress}></progress>
</div>
