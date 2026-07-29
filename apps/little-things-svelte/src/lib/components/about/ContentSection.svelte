<script lang="ts">
import type { Snippet } from "svelte";

interface Props {
  title?: string;
  children: Snippet;
  class?: string;
}

let { title, children, class: className = "" }: Props = $props();
</script>

<section class="w-full px-6 py-16 {className}">
	<div class="mx-auto max-w-3xl">
		{#if title}
			<h2 class="mb-8 text-3xl font-bold tracking-tight text-foreground">{title}</h2>
		{/if}
		<div class="space-y-6 text-base font-light leading-relaxed text-muted-foreground">
			{@render children()}
		</div>
	</div>
</section>
