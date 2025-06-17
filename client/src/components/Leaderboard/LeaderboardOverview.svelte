<script>
    import SkillToggleBar from "../SkillToggleBar/SkillToggleBar.svelte";
    import Leaderboard from "./Leaderboard.svelte";
    let filterId = $state(1);

    function handleToggle(id) {
        console.log("Id:", id);
        filterId = id;
    }
</script>

<SkillToggleBar {filterId} onToggle={handleToggle} />
<Leaderboard skillId={filterId} />
