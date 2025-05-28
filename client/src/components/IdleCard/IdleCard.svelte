<script>
    import ProgressBar from "../ProgressBar/ProgressBar.svelte";
    let count = $state(0);
    let duration = $state(0);
    let repeat = $state(false);
    let interval;
    function start() {
        console.log("start");
        duration = 2000;
        repeat = true;
        interval = setInterval(() => count++, duration);
    }

    function stop() {
        console.log("stop");
        repeat = false;
        clearTimeout(interval);
    }

    function increment() {
        count++;
    }
</script>

<div>
    <h1>IdleCard</h1>
    <div>
        {count}
    </div>
    <ProgressBar {duration} {repeat} />
    <button onclick={start}>Start</button>
    <button onclick={stop}>Stop</button>
</div>
