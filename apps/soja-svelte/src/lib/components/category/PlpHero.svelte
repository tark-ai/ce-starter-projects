<script lang="ts">
import Reveal from "../Reveal.svelte";

interface Props {
  title: string;
  subtitle?: string;
  query?: string;
}

let { title, subtitle, query }: Props = $props();
</script>

<section class="soja-container pt-16 pb-12 tablet:pt-24 tablet:pb-16">
	<Reveal>
		<h1 class="font-display text-[2rem] tracking-display tablet:text-display">
			{query ? `Results for “${query}”` : title}
		</h1>
	</Reveal>
	{#if subtitle}
		<Reveal delay={90}>
			<p class="mt-6 max-w-[600px] text-meta leading-relaxed text-muted-foreground">{subtitle}</p>
		</Reveal>
	{/if}
</section>
