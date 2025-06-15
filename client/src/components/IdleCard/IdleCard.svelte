<script>
    import { onDestroy, onMount } from "svelte";
    import ProgressBar from "../ProgressBar/ProgressBar.svelte";
    import { socketStore } from "../../stores/socketStore.js";
    import { idleStore } from "../../stores/idleStore.js";
    import { userResourcesStore } from "../../stores/userResourcesStore.js";
    import IdleStartStopButton from "./IdleStartStopButton.svelte";

    const { idle } = $props();
    const resource = $derived($userResourcesStore.get(idle.resource_id));
    let cooldown = $state(false);

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

    function triggerCooldown() {
        if (cooldown) return;
        cooldown = true;
        setTimeout(() => {
            cooldown = false;
        }, 220);
    }

    function handleStart() {
        triggerCooldown();
        idleStore.start(idle.idle_id);
    }

    function handleStop() {
        triggerCooldown();
        idleStore.stop(idle.idle_id);
    }
</script>

<div class="my-5">
    <h1>{idle.idle}</h1>
    <div>
        {resource.amount}
    </div>
    <progress class="progress-bar" value={idle.progress}></progress>
    <!-- <div>
        {#if idle.active && !cooldown}
            <button onclick={stop}>Stop</button>
        {:else if !idle.active && !cooldown}
            <button onclick={start}>Start</button>
        {:else if cooldown}
            <h3>cooldown</h3>
        {/if}
    </div> -->
    <div>
        <IdleStartStopButton
            active={idle.active}
            {cooldown}
            onStart={handleStart}
            onStop={handleStop}
        />
    </div>
</div>

<style>
    .progress-bar {
        transition: width 0.1s linear;
    }
</style>
