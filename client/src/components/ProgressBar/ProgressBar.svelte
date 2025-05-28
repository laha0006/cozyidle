<script>
    import { tweened } from "svelte/motion";
    import { linear } from "svelte/easing";
    import { onMount } from "svelte";

    const { duration, repeat } = $props();

    let count = 0;

    const progress = tweened(0, { duration: duration, easing: linear });

    function reset() {
        count++;
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
    <progress value={$progress}></progress>
</div>
