<script>
    import { onDestroy, onMount } from "svelte";
    import ProgressBar from "../ProgressBar/ProgressBar.svelte";
    import { socketStore } from "../../stores/socketStore.js";
    import { idleStore } from "../../stores/idleStore.js";
    import { userResourcesStore } from "../../stores/userResourcesStore.js";
    import IdleStartStopButton from "./IdleStartStopButton.svelte";

    const { idle, selected = false, controls = true } = $props();
    const resource = $derived($userResourcesStore.get(idle.resource_id));
    const unlocked = $derived(idle.unlocked);
    let cooldown = $state(false);

    const IdleServerEvent = Object.freeze({
        INIT: "idle:server:init",
        UPDATE: "idle:server:primary",
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
        }, 420);
    }

    function handleStart() {
        if (!controls) return;
        triggerCooldown();
        idleStore.start(idle.idle_id);
    }

    function handleStop() {
        if (!controls) return;
        triggerCooldown();
        idleStore.stop(idle.idle_id);
    }
</script>

<div class="">
    <h1 clasS={unlocked ? "text-foreground" : "text-gray-400"}>
        {idle.idle}
    </h1>
    {#if unlocked}
        <div>
            {resource.amount}
        </div>
        <progress class="progress-bar" value={idle.progress}></progress>
        <div>
            <IdleStartStopButton
                active={idle.active}
                {cooldown}
                onStart={handleStart}
                onStop={handleStop}
            />
        </div>
    {:else}
        <div>
            <button> unlock </button>
            {idle.level_req}
        </div>
    {/if}
</div>

<style>
    .progress-bar::-webkit-progress-bar {
        background-color: var(--muted);
    }
    .progress-bar::-webkit-progress-value {
        background-color: var(--primary);
    }
    .progress-bar {
        transition: width 0.1s linear;
    }
</style>
