<script>
    import { onMount } from "svelte";
    import { getFetch } from "../../util/fetch";
    import { leaderboards } from "../../stores/leaderboardStore.js";
    const { skillId } = $props();
    const leaderboard = $derived($leaderboards?.get(skillId));
</script>

<div class="flex justify-center items-center">
    <table>
        <thead>
            <tr class="">
                <th class="px-5">Rank</th>
                <th class="px-5">Username</th>
                <th class="px-5">Level</th>
                <th class="px-5">Experience</th>
            </tr>
        </thead>
        <tbody>
            {#each leaderboard as entry, index}
                <tr>
                    <td>{index + 1}</td>
                    <td>{entry.username}</td>
                    <td>{entry.level}</td>
                    <td>{entry.experience}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
