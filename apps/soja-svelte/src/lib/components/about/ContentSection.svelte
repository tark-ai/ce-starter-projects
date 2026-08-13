<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "$lib/utils";
import Reveal from "../Reveal.svelte";

interface Props {
  children: Snippet;
  title?: string;
  class?: string;
}

let { children, title, class: className = "" }: Props = $props();
</script>

<Reveal as="section" class={cn("soja-container py-10", className)}>
	{#if title}
		<h2 class="mb-6 font-display text-title tracking-display">{title}</h2>
	{/if}
	<div class="max-w-[680px] space-y-5 text-meta leading-relaxed text-foreground/80">
		{@render children()}
	</div>
</Reveal>
