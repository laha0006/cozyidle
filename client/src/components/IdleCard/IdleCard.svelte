<script>
    import { onDestroy, onMount } from "svelte";
    import ProgressBar from "../ProgressBar/ProgressBar.svelte";
    import { socketStore } from "../../stores/socketStore.js";
    import { idleStore } from "../../stores/idleStore.js";

    // let { value, progress, idleId } = $props();
    const { idle } = $props();
    // let { progress, amount } = $derived(
    //     $idleStore.find((idle) => {
    //         console.log("FINDING");
    //         return idle.idle_id === idleId;
    //     })
    // );

    onMount(() => {});

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

    // function loop() {
    //     progress = Math.min((Date.now() - lastIncrement) / 2000, 1);
    //     const now = Date.now();
    //     const incrementCount = Math.floor((now - lastIncrement) / 2000);
    //     if (incrementCount > 0) {
    //         count += incrementCount;
    //         lastIncrement += incrementCount * 2000;
    //     }
    //     rafLoopId = requestAnimationFrame(loop);
    // }

    function start() {
        $socketStore.emit(IdleClientEvent.START, { idleId: idle.idle_id });
    }

    function stop() {
        $socketStore.emit(IdleClientEvent.STOP, { idleId: idle.idle_id });
    }

    $effect(() => {
        if ($socketStore) {
            $socketStore.on(IdleServerEvent.INIT, (data) => {
                console.log("STARTED:", data);
            });

            $socketStore.on(IdleServerEvent.STOPPED, (data) => {
                console.log("STOPPED:", data);
            });
        }
    });

    // onDestroy(() => {
    //     $socketStore.off(IdleServerEvent.INIT);
    //     $socketStore.off(IdleServerEvent.STOPPED);
    // });
</script>

<div>
    <h1>{idle.idle}</h1>
    <div>
        {idle.amount}
    </div>
    <progress value={idle.progress}></progress>
    <div>
        <button onclick={start}>Start</button>
        <button onclick={stop}>Stop</button>
    </div>
</div>
