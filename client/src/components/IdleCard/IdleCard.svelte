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
        console.log("running:", running);
        const now = Date.now();
        const incrementCount = Math.floor((now - lastIncrement) / 2000);
        if (incrementCount > 0) {
            count += incrementCount;
            // lastIncrement = Date.now();
            lastIncrement += incrementCount * 2000;
        }
        rafLoopId = requestAnimationFrame(loop);
    }

    function start() {
        if (running) return;
        console.log($socketStore);
        $socketStore.emit(IdleClientEvent.START);
        running = true;
        loop();
    }

    function stop() {
        if (!running) return;
        console.log("stopped function called");
        $socketStore.emit(IdleClientEvent.STOP);
        cancelAnimationFrame(rafLoopId);
        cancelAnimationFrame(rafUpdateId);
    }

    function update() {
        progress = Math.min((Date.now() - lastIncrement) / 2000, 1);
        if (running) rafUpdateId = requestAnimationFrame(update);
    }

    $effect(() => {
        if (!running) {
            console.log("not running!");
            progress = 0;
            return;
        }
        rafUpdateId = requestAnimationFrame(update);
        return () => cancelAnimationFrame(rafUpdateId);
    });

    $effect(() => {
        if ($socketStore) {
            $socketStore.on(IdleServerEvent.INIT, (data) => {
                console.log("STARTED");
                const { started_unix, resource_count } = data;
                // console.log(new_started * 1000);
                // console.log(Date.now());
                // console.log(new_count);
                // lastIncrement = started_unix * 1000;
                lastIncrement = Date.now();
                startTime = lastIncrement;
                count = resource_count;
                if (debugging) {
                    // stop();
                }
                // running = true;
                // loop();

                // count = new_count;
            });

            $socketStore.on(IdleServerEvent.STOPPED, (data) => {
                // console.log("STOPPED:", data);
                const { resource_count } = data;
                running = false;
                cancelAnimationFrame(rafLoopId);
                cancelAnimationFrame(rafUpdateId);
                // console.log("interpolated: ", count);
                // console.log("actual:       ", resource_count);
                // console.log("diff:         ", count - resource_count);
                diff = count - resource_count;
                console.log("diff: ", diff);
                if (diff > 0) {
                    console.log("ISSUE DETECTED");
                    debugging = false;
                    foundBug = true;
                    stop();
                }
                count = resource_count;
                stopTime = Date.now();
                if (debugging) {
                    // start();
                }
                // console.log((stopTime - startTime) / 2000);
            });
        }
    });

    onMount(() => {
        startBtn = document.getElementById("startBtn");
        stopBtn = document.getElementById("stopBtn");

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
        <button id="startBtn" onclick={start}>Start</button>
        <button id="stopBtn" onclick={stop}>Stop</button>
    </div>
    <div>
        <button onclick={debug}>DEBUG</button>
    </div>
    {#if debugging}
        <div>
            <h3>DEBUGGING ACTIVE</h3>
        </div>
    {/if}

    {#if foundBug}
        <div>
            <h3>FOUND BUG</h3>
        </div>
    {/if}
</div>
