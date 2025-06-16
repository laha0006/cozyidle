<script>
    import { flip } from "svelte/animate";
    import IdleCard from "./IdleCard.svelte";
    import { fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";

    const { idles } = $props();
    const skillName = $derived(idles[0].skill);
    const hasOneActive = $derived(idles.some((idle) => idle.active));
    let showList = $state(false);

    let selected = $state(idles[0].idle_id);

    let sortedIds = $state(
        idles
            .map((i) => i.idle_id)
            .sort((a, b) => {
                if (a === selected) return -1;
                if (b === selected) return 1;
                return 0;
            })
    );
    const idlesById = $derived(new Map(idles.map((i) => [i.idle_id, i])));

    function toggleShowList() {
        showList = !showList;
    }

    function selectIdle(idleId) {
        selected = idleId;
        sortedIds = sortedIds.sort((a, b) => {
            if (a === selected) return -1;
            if (b === selected) return 1;
            return 0;
        });
    }
</script>

<div
    class="relative max-w-72 my-5 bg-card text-card-foreground border-border border-1 rounded-2xl min-w-72"
>
    <div class="flex gap-x-1 justify-around text-center my-0 py-0">
        <div class=""></div>
        <div class="my-0 py-0">
            <h1>{skillName}</h1>
            {hasOneActive}
        </div>
        <div class="">
            <button onclick={toggleShowList}>Select</button>
        </div>
    </div>
    {#if showList}
        <div
            class="absolute flex flex-col bg-popover rounded-b-2xl z-1 border-border border-x-1 border-b-1 w-full"
        >
            {#each sortedIds as id (id)}
                <button
                    onclick={() => selectIdle(id)}
                    animate:flip={{
                        duration: 400,
                    }}
                    disabled={!idlesById.get(id).unlocked ||
                        (hasOneActive && selected !== id)}
                >
                    <IdleCard
                        idle={idlesById.get(id)}
                        selected={selected === id}
                        controls={selected === id}
                    />
                </button>
            {/each}
        </div>
    {/if}
    {#if selected && idlesById.has(selected)}
        <div>
            <IdleCard idle={idlesById.get(selected)} />
        </div>
    {/if}
</div>
