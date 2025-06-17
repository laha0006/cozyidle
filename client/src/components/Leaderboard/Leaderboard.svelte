<script>
    import { onMount } from "svelte";
    import { getFetch } from "../../util/fetch";
    import { userSkillsStore } from "../../stores/userSkillsStore";
    const { skillId } = $props();
    let leaderboard = $state([]);
</script>

{skillId}
<div class="flex flex-col">
    {#each leaderboard as entry}
        {entry.username}
    {/each}
</div>
