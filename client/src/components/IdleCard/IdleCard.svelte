<script>
    import { onDestroy, onMount } from "svelte";
    import ProgressBar from "../ProgressBar/ProgressBar.svelte";
    import { socketStore } from "../../stores/socketStore.js";
    import { idleStore } from "../../stores/idleStore.js";

    const { idle } = $props();

    onMount(() => {
        console.log("idle:", idle);
        console.log("acitve:", idle.active);
    });

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

    function start() {
        idleStore.start(idle.idle_id);
    }

    function stop() {
        idleStore.stop(idle.idle_id);
    }

    $effect(() => {
        if ($socketStore) {
        }
    });

    onDestroy(() => {
        $socketStore.off(IdleServerEvent.INIT);
        $socketStore.off(IdleServerEvent.STOPPED);
    });
</script>

<div class="my-5">
    <h1>{idle.idle}</h1>
    <div>
        {idle.amount}
    </div>
    <progress value={idle.progress}></progress>
    <div>
        {#if idle.active}
            <button onclick={stop}>Stop</button>
        {:else}
            <button onclick={start}>Start</button>
        {/if}
    </div>
</div>
