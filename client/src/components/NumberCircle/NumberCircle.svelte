<script>
    const { number } = $props();
</script>

<div class="circle border-1">
    <span class="number">
        {number}
    </span>
</div>

<style>
    .circle {
        width: 2rem;
        height: 2rem;
        color: var(--chart-3);

        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-weight: bold;
        font-size: calc(2rem * 0.45);
    }

    .number {
        transform: translateX(-1px);
    }
</style>
