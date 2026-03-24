<script lang="ts">
let { title, subtitle }: { title: string; subtitle?: string } = $props();
</script>

<header class="pr-6 py-16 border-b border-border">
	<h1 class="text-4xl md:text-5xl font-light text-foreground mb-4">{title}</h1>
	{#if subtitle}
		<p class="text-lg text-muted-foreground">{subtitle}</p>
	{/if}
</header>
