<script>
    import { userSkillsStore } from "../../stores/userSkillsStore";
    const { filterId, onToggle } = $props();
</script>

<div
    class="flex flex-wrap lg:gap-5 gap-1 mb-5 p-1 justify-center items-center bg-card border-border border-1"
>
    {#each $userSkillsStore as skill}
        <button
            class="{filterId === skill.id
                ? 'border-border bg-muted'
                : 'border-transparent'} border-2 p-1"
            onclick={() => onToggle(skill.id)}
        >
            {skill.name}
        </button>
    {/each}
</div>
