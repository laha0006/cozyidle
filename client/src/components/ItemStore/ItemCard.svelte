<script>
    const { item, onBuy } = $props();
    import { userSkillsStore } from "../../stores/userSkillsStore";
    import { userResourcesStore } from "../../stores/userResourcesStore";

    const skillId = $state(item.skillId);
    const requirement = $state(item.requirement);
    const currentSkillLevel = $derived($userSkillsStore[skillId - 2]?.level);
    const skillCheck = $derived(currentSkillLevel >= requirement);

    const currentGold = $derived($userResourcesStore.get(1).amount); // 1 is gold
    const goldCheck = $derived(currentGold >= item.price);
</script>

<div
    class="bg-card border-border rounded-2xl border-1 text-center flex flex-col justify-center min-w-50"
>
    <div>
        {item.name}
    </div>
    <div class="flex justify-between items-center p-2">
        <div class="flex flex-col justify-center items-center w-20">
            <div>req</div>
            <div class={skillCheck ? "text-green-600" : "text-red-500"}>
                {item.requirement}
            </div>
        </div>
        <div class="flex flex-col justify-center items-center w-20">
            <div>price</div>
            <div class={goldCheck ? "text-green-600" : "text-red-500"}>
                {item.price}
            </div>
        </div>
        <div class="flex flex-col justify-center items-center w-20">
            <div>bonus</div>
            <div>
                {item.bonus}
            </div>
        </div>
    </div>
    <div>
        <button
            onclick={onBuy}
            class={goldCheck && skillCheck ? "text-foreground" : "text-muted"}
            disabled={!goldCheck && !skillCheck}
        >
            Buy</button
        >
    </div>
</div>
