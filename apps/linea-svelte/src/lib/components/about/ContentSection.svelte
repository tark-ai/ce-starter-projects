<script lang="ts">
import type { Snippet } from "svelte";

let {
  title,
  children,
  class: className = "",
}: { title?: string; children: Snippet; class?: string } = $props();
</script>

<section class="pr-6 py-16 {className}">
	{#if title}
		<h2 class="text-3xl font-light text-foreground mb-8">{title}</h2>
	{/if}
	{@render children()}
</section>
