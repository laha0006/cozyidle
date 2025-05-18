<script>
    import { onMount } from "svelte";

    const { name, age, params } = $props();
    console.log(name, age, params);

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
    {JSON.stringify(params)}
</div>
<div></div>
