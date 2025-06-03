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
    let diff = 0;
    let debugging = $state(false);
    let foundBug = $state(false);

    // Find the buttons (adjust selectors if needed)
    let startBtn;
    let stopBtn;

    // Function to spam start/stop
    function spamStartStop(times = 20, delay = 50) {
        let i = 0;

        const interval = setInterval(() => {
            console.log("i:", i);
            if (i >= times) {
                debugging = false;
                clearInterval(interval);
                return;
            }

            // Alternate: even = start, odd = stop
            if (i % 2 === 0) {
                startBtn.click();
            } else {
                stopBtn.click();
            }

            i++;

            if (diff !== 0) {
                console.log("WOOPS");
                console.log("diff: ", diff);
                stop();
                running = false;
                cancelAnimationFrame(rafLoopId);
                cancelAnimationFrame(rafUpdateId);
                console.log("end of woops");
                console.log("i: ", i);
                debugging = false;
                foundBug = true;
                clearInterval(interval);
                return;
            }
        }, delay);
    }

    function debug() {
        debugging = true;
        // start();
        spamStartStop(4000, 85);
    }

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
        if (!running) return;
        const now = Date.now();
        const incrementCount = Math.floor((now - lastIncrement) / 2000);
        if (incrementCount > 0) {
            count += incrementCount;
            lastIncrement += incrementCount * 2000;
        }
        rafLoopId = requestAnimationFrame(loop);
    }

    function start() {
        if (running) return;
        $socketStore.emit(IdleClientEvent.START, { idleId: 1 });
        running = true;
        lastIncrement = Date.now();
        loop();
    }

    function stop() {
        if (!running) return;
        console.log("stopped function called");
        $socketStore.emit(IdleClientEvent.STOP, { idleId: 1 });
        cancelAnimationFrame(rafLoopId);
        cancelAnimationFrame(rafUpdateId);
    }

    function update() {
        progress = Math.min((Date.now() - lastIncrement) / 2000, 1);
        if (running) rafUpdateId = requestAnimationFrame(update);
    }

    $effect(() => {
        if (!running) {
            // console.log("not running!");
            progress = 0;
            return;
        }
        rafUpdateId = requestAnimationFrame(update);
        return () => cancelAnimationFrame(rafUpdateId);
    });

    $effect(() => {
        if ($socketStore) {
            $socketStore.on(IdleServerEvent.INIT, (data) => {
                const { started_unix, resource_amount } = data;
                count = resource_amount;
                // running = true;
                // loop();
            });

            $socketStore.on(IdleServerEvent.STOPPED, (data) => {
                const { resource_amount } = data;
                running = false;
                cancelAnimationFrame(rafLoopId);
                cancelAnimationFrame(rafUpdateId);
                count = resource_amount;
            });
        }
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
        <button id="startBtn" onclick={start}>Start</button>
        <button id="stopBtn" onclick={stop}>Stop</button>
    </div>
</div>
