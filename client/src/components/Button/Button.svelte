<script>
    import { onMount } from "svelte";
    let color = $state("bg-primary");
    const { type, onclick } = $props();
    onMount(() => {
        switch (type) {
            case "primary":
                color = "bg-primary";
                break;
            case "danger":
                color = "bg-red-500";
                break;
        }
    });
</script>

<button
    class="flex items-center justify-center pb-1 cursor-pointer {color} text-white font-bold rounded-xl px-2"
    {onclick}
>
    <slot />
</button>
