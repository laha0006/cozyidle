<script>
    import { userItemStore } from "../../stores/userItemStore.js";
</script>

{#each $userItemStore as item}
    {#if !item.owned}
        <div>
            {item.name}
            {item.price}
        </div>
        <div>
            <button> buy </button>
        </div>
    {/if}
{/each}
