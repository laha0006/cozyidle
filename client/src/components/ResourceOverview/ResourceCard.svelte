<script>
    import { userResourcesStore } from "../../stores/userResourcesStore.js";
    import { error, success } from "../../util/toasts";
    import Button from "../Button/Button.svelte";

    const { resourceId, resource } = $props();
    console.log("resourceID:", resourceId);
    console.log("resource:", resource);

    let sellAmount = $state(0);
    const sellPrice = $derived(resource?.value * sellAmount);
    function sell() {
        if (sellAmount > resource.amount) {
            error("You do have enough resources to sell!");
            return;
        }
        userResourcesStore.sell(resourceId, sellAmount);
    }
</script>

<div class="flex flex-col min-w-72 rounded-2xl bg-card border-border border-1">
    <div>
        {resource.name}
    </div>
    <div>
        {resource.amount}
    </div>
    <div class="flex justify-center">
        <div class="flex items-center px-2">
            <input
                bind:value={sellAmount}
                max={resource.amount}
                class="bg-muted px-2 w-20 rounded text-center"
                type="number"
            />
        </div>
        <div class="p-2 flex justify-center items-center">
            <Button type="primary" onclick={sell}>Sell</Button>
        </div>
    </div>
    <div>
        sell for: {sellPrice}
    </div>
</div>
