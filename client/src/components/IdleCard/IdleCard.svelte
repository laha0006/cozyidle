<script>
    import { onDestroy, onMount } from "svelte";
    import ProgressBar from "../ProgressBar/ProgressBar.svelte";
    import { socketStore } from "../../stores/socketStore.js";
    import { idleStore } from "../../stores/idleStore.js";
    import { userResourcesStore } from "../../stores/userResourcesStore.js";
    import { upgradesStore } from "../../stores/upgradesStore.js";
    import IdleStartStopButton from "./IdleStartStopButton.svelte";
    import { Spring, spring } from "svelte/motion";

    const { idle, selected = false, controls = true } = $props();
    const resource = $derived($userResourcesStore.get(idle.resource_id));
    const unlocked = $derived(idle.unlocked);
    const upgrades = $derived(
        $upgradesStore
            .get(idle.idle_id)
            .filter((upgrade) => upgrade.level > level)
    );
    const level = $derived(idle.level);
    let cooldown = $state(false);
    let showUpgrades = $state(false);

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

    function toggleShowUpgrades() {
        if (upgrades.length === 0 || !controls) return;
        showUpgrades = !showUpgrades;
    }

    function handleStart() {
        if (!controls) return;
        triggerCooldown();
        idleStore.start(idle.idle_id);
    }

    function handleStop() {
        console.log("handle stop!");
        if (!controls) return;
        triggerCooldown();
        idleStore.stop(idle.idle_id);
    }
    let isFirstRun = true;
    const scale = spring(1, {
        stiffness: 0.1,
        damping: 0.2,
    });
    let springTimeoutId;
    // const spring = new Spring(1);
    $effect(() => {
        if (resource.amount) {
            console.log("poke!");
            clearTimeout(springTimeoutId);
            scale.set(1.2, {
                stiffness: 0.1,
                damping: 0.2,
            });
            springTimeoutId = setTimeout(() => {
                scale.set(1, {
                    stiffness: 0.1,
                    damping: 0.2,
                });
            }, 100);
        }
        // console.log("effect!");
        // if (isFirstRun) {
        //     console.log("first run!");
        //     isFirstRun = false;
        //     return;
        // }
        // if (resource.amount) {
        //     console.log("spring poked!");
        //     spring.target = 1.2;
        //     setTimeout(() => {
        //         spring.target = 1;
        //     }, 100);
        // }
    });
</script>

<div class="relative">
    <h1 clasS={unlocked ? "text-foreground" : "text-gray-400"}>
        {idle.idle}
    </h1>
    {#if unlocked}
        <div style="transform: scale({$scale})">
            {resource.amount}
            {controls}
        </div>
        <progress class="progress-bar" value={idle.progress}></progress>
        <div class="flex gap-28">
            <button onclick={toggleShowUpgrades}>{level}</button>
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
    {#if showUpgrades}
        <div class="absolute flex flex-col bg-card w-full">
            {#each upgrades as upgrade}
                {upgrade.level}
            {/each}
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
