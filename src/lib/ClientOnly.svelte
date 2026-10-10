<script lang="ts">
    import { onMount, type Component } from "svelte";

    let { component: Content }: { component: Component } = $props();
    let mounted = $state(false);

    onMount(() => {
        mounted = true;
    });
</script>

<div class="fabric-component">
    {#if mounted}
        <Content />
    {/if}
</div>
