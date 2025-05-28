<script>
    import { tweened } from "svelte/motion";
    import { linear } from "svelte/easing";
    import { onMount } from "svelte";

    const { duration } = $props();

    let active = true;
    let count = 0;

    const progress = tweened(0, { duration: 2000, easing: linear });

    function reset() {
        count++;
        if (count === 5) {
            active = false;
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
            if (value === 1 && active) {
                reset();
            }
            if (!active) {
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
