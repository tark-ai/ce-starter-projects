<script lang="ts">
import { cn } from "$lib/utils";
import Reveal from "../Reveal.svelte";

interface Props {
  title: string;
  subtitle?: string;
  class?: string;
}

let { title, subtitle, class: className = "" }: Props = $props();
</script>

<header class={cn("soja-container pt-16 pb-12 tablet:pt-24 tablet:pb-20", className)}>
	<Reveal>
		<h1 class="font-display text-[2rem] tracking-display tablet:text-display">{title}</h1>
	</Reveal>
	{#if subtitle}
		<Reveal delay={90}>
			<p class="mt-8 max-w-[600px] text-meta leading-relaxed text-muted-foreground">{subtitle}</p>
		</Reveal>
	{/if}
</header>
