<script>
    import { onDestroy, onMount } from "svelte";
    import ProgressBar from "../ProgressBar/ProgressBar.svelte";
    import { socketStore } from "../../stores/socketStore.js";

    let { value, progress } = $props();

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
        $socketStore.emit(IdleClientEvent.START, { idleId: 1 });
        running = true;
        lastIncrement = Date.now();
    }

    function stop() {
        $socketStore.emit(IdleClientEvent.STOP, { idleId: 1 });
    }

    $effect(() => {
        if ($socketStore) {
            $socketStore.on(IdleServerEvent.INIT, (data) => {
                const { started_unix, resource_amount } = data;
                count = resource_amount;
            });

            $socketStore.on(IdleServerEvent.STOPPED, (data) => {
                console.log("STOPPED?");
                const { resource_amount } = data;
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
        {value}
    </div>
    <!-- <ProgressBar {duration} {repeat} /> -->
    <progress value={progress}></progress>
    <div>
        <button id="startBtn" onclick={start}>Start</button>
        <button id="stopBtn" onclick={stop}>Stop</button>
    </div>
</div>
