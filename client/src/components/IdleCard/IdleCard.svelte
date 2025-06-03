<script>
    import { onDestroy, onMount } from "svelte";
    import ProgressBar from "../ProgressBar/ProgressBar.svelte";
    import { socketStore } from "../../stores/socketStore.js";

    let count = $state(0);
    let progress = $state(0);
    let lastIncrement = $state(Date.now());
    let running = $state(false);

    let rafLoopId;

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
        progress = Math.min((Date.now() - lastIncrement) / 2000, 1);
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
        progress = 0;
        $socketStore.emit(IdleClientEvent.STOP, { idleId: 1 });
        cancelAnimationFrame(rafLoopId);
    }

    $effect(() => {
        if (!running) {
            stop();
        } else {
            start();
        }
    });

    $effect(() => {
        if ($socketStore) {
            $socketStore.on(IdleServerEvent.INIT, (data) => {
                const { started_unix, resource_amount } = data;
                count = resource_amount;
            });

            $socketStore.on(IdleServerEvent.STOPPED, (data) => {
                const { resource_amount } = data;
                running = false;
                cancelAnimationFrame(rafLoopId);
                count = resource_amount;
            });
        }
    });

    onDestroy(() => {
        $socketStore.off(IdleServerEvent.INIT);
        $socketStore.off(IdleServerEvent.STOPPED);
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
