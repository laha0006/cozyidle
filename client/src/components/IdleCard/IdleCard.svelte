<script>
    import { onMount } from "svelte";
    import { spring } from "svelte/motion";

    import { idleStore } from "../../stores/idleStore.js";
    import { userResourcesStore } from "../../stores/userResourcesStore.js";
    import { upgradesStore } from "../../stores/upgradesStore.js";

    import IdleStartStopButton from "./IdleStartStopButton.svelte";
    import NumberCircle from "../NumberCircle/NumberCircle.svelte";
    import Button from "../Button/Button.svelte";

    const { idle, selected = false, controls = true } = $props();

    const resource = $derived($userResourcesStore.get(idle.resourceId));
    const unlocked = $derived(idle.unlocked);
    const level = $derived(idle.level);
    const upgrades = $derived(
        $upgradesStore
            .get(idle.idleId)
            .filter((upgrade) => upgrade.level === level + 1)
    );
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

    function unlockIdle() {
        idleStore.unlock(idle.idleId);
    }

    function triggerCooldown() {
        if (cooldown) return;
        cooldown = true;
        setTimeout(() => {
            cooldown = false;
        }, 420);
    }

    function buyUpgrade() {
        const upgradeId = upgrades[0].id;
        idleStore.buyUpgrade(upgradeId);
        toggleShowUpgrades();
    }

    function toggleShowUpgrades() {
        if ((!showUpgrades && upgrades.length === 0) || !controls) return;
        showUpgrades = !showUpgrades;
    }

    function handleStart() {
        if (!controls) return;
        triggerCooldown();
        idleStore.start(idle.idleId);
    }

    function handleStop() {
        if (!controls) return;
        triggerCooldown();
        idleStore.stop(idle.idleId);
    }

    let isFirstRun = true;
    let prevAmount;
    let springTimeoutId;

    onMount(() => {
        prevAmount = resource.amount;
    });

    const scale = spring(1, {
        stiffness: 0.1,
        damping: 0.2,
    });
    $effect(() => {
        if (resource.amount > prevAmount) {
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
        prevAmount = resource.amount;
    });
</script>

<div class="relative">
    <button class="container cursor-pointer" onclick={toggleShowUpgrades}>
        <div class="px-4 flex justify-between">
            <div class="text-chart-3 flex items-center">
                <NumberCircle number={level} />
            </div>
            <h1 clasS={unlocked ? "text-foreground" : "text-gray-400"}>
                {idle.idle}
            </h1>
            <div class="">
                {#if showUpgrades}
                    <i class="fa-solid fa-angle-up fa-2xs"></i>
                {:else}
                    <i class="fa-solid fa-angle-down fa-2xs"></i>
                {/if}
            </div>
        </div>
    </button>
    {#if unlocked}
        <div class="text-primary" style="transform: scale({$scale})">
            {resource.amount}
        </div>
        <progress class="progress-bar" value={idle.progress}></progress>
        <div class="px-2 flex justify-between">
            <div></div>
            <IdleStartStopButton
                active={idle.active}
                {cooldown}
                onStart={handleStart}
                onStop={handleStop}
            />
            <div></div>
        </div>
    {:else}
        <div class="flex flex-col justify-center px-2">
            <div clasS="flex justify-between text-center gap-1 p-2">
                <div>
                    <p>req</p>
                    <p>{idle.levelReq}</p>
                </div>
                <div>
                    <p>price</p>
                    <p>{idle.price}</p>
                </div>
                <div>
                    <p>-</p>
                    <p>
                        <Button type="Primary" onclick={unlockIdle}
                            >Unlock</Button
                        >
                    </p>
                </div>
            </div>
        </div>
    {/if}
    {#if showUpgrades}
        <div
            class="absolute flex flex-col bg-popover w-full rounded-b-2xl border-b-1 z-5 border-x-1 border-border top-24"
        >
            {#each upgrades as upgrade}
                <div class="flex px-1 justify-between text-center">
                    <div class="w-15 py-2">
                        <p>req</p>
                        <p>{upgrade.levelReq}</p>
                    </div>
                    <div class="w-15 py-2">
                        <p>lvl</p>
                        <p>{upgrade.level}</p>
                    </div>
                    <div class="w-15 py-2">
                        <p>price</p>
                        <p>{upgrade.price}</p>
                    </div>
                    <div class="w-15 py-2">
                        <p>-</p>
                        <Button type="primary" onclick={buyUpgrade}>buy</Button>
                    </div>
                </div>
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
