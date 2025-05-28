<script>
    import ProgressBar from "../ProgressBar/ProgressBar.svelte";
    let count = $state(0);
    let duration = $state(0);
    let repeat = $state(true);

    function start() {
        console.log("start");
        duration = 2000;
    }
</script>

<div>
    <h1>IdleCard</h1>
    <div>
        {count}
    </div>
    <ProgressBar {duration} {repeat} />
    <button onclick={start}>Start</button>
    <button>Stop</button>
</div>
