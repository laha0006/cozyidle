<script>
    import { onDestroy, onMount } from "svelte";
    import ProgressBar from "../ProgressBar/ProgressBar.svelte";
    import { socketStore } from "../../stores/socketStore.js";
    let count = $state(0);
    let progress = $state(0);
    let lastIncrement = $state(Date.now());
    let rafLoopId;
    let rafUpdateId;
    let running = $state(false);
    let startTime;
    let stopTime;
    let expected = 0;

    const IdleServerEvent = Object.freeze({
        INIT: "idle:server:init",
        UPDATE: "idle:server:update",
        STOPPED: "idle:server:stopped",
    });

    const IdleClientEvent = Object.freeze({
        START: "idle:client:start",
        STOP: "idle:client:stop",
        SYNC: "idle:client:sync",
    });

    function loop() {
        const now = Date.now();
        const incrementCount = Math.floor((now - lastIncrement) / 2000);
        if (incrementCount > 0) {
            count += incrementCount;
            lastIncrement = Date.now();
        }
        rafLoopId = requestAnimationFrame(loop);
    }

    function start() {
        if (running) return;
        $socketStore.emit(IdleClientEvent.START);
        running = true;
        lastIncrement = Date.now();
        startTime = Date.now();
        loop();
    }

    function stop() {
        if (!running) return;
        console.log("stop");
        running = false;
        cancelAnimationFrame(rafLoopId);
        cancelAnimationFrame(rafUpdateId);
    }

    function update() {
        progress = Math.min((Date.now() - lastIncrement) / 2000, 1);
        console.log(lastIncrement);
        console.log("progress:", progress);
        if (running) rafUpdateId = requestAnimationFrame(update);
    }

    $effect(() => {
        if (!running) {
            progress = 0;
            return;
        }
        rafUpdateId = requestAnimationFrame(update);
        return () => cancelAnimationFrame(rafUpdateId);
    });

    $effect(() => {
        if ($socketStore) {
            $socketStore.on(IdleServerEvent.INIT, (data) => {
                console.log("STARTED:", data);
                const { new_started, new_count } = data;
                console.log(new_started), console.log(new_count);
                lastIncrement = new_started;
                // count = new_count;
            });
        }
    });

    onMount(() => {
        // console.log($socketStore);
    });

    onDestroy(() => {
        stop();
    });
</script>

<div>
    <h1>IdleCard</h1>
    <div>
        {count}
    </div>
    <!-- <ProgressBar {duration} {repeat} /> -->
    <progress value={progress}></progress>
    <div>
        <button onclick={start}>Start</button>
        <button onclick={stop}>Stop</button>
    </div>
</div>
