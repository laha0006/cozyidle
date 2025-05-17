<script>
    import { onMount } from "svelte";

    const { name, age, id } = $props();
    console.log(name, age, id);

    onMount(() => {
        console.log(location);
    });
</script>

<div>
    {name}
</div>
<div>
    {age}
</div>
<div>
    {id}
</div>
<div></div>
