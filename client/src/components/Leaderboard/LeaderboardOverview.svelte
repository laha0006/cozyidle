<script>
    import SkillToggleBar from "../SkillToggleBar/SkillToggleBar.svelte";
    import Leaderboard from "./Leaderboard.svelte";

    let filterId = $state(2);

    function handleToggle(id) {
        filterId = id;
    }
</script>

<div class="flex flex-col justify-center">
    <SkillToggleBar {filterId} onToggle={handleToggle} />
    <Leaderboard skillId={filterId} />
</div>
