<script>
    const { text, active } = $props();
</script>

<button
    class="{active
        ? 'text-primary-foreground'
        : ''} cursor-pointer hover:text-primary"
>
    {text}
</button>
