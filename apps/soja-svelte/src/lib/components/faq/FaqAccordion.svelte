<script lang="ts">
import Accordion from "../Accordion.svelte";
import Reveal from "../Reveal.svelte";

interface FaqItem {
  question: string;
  answer: string;
}

interface Props {
  items: FaqItem[];
  title?: string;
  subtitle?: string;
}

let { items, title = "FAQs", subtitle }: Props = $props();

const accordionItems = $derived(items.map((item) => ({ id: item.question, label: item.question })));
const answers = $derived(new Map(items.map((item) => [item.question, item.answer])));
</script>

<div class="soja-container py-16 tablet:py-24">
	<Reveal>
		<h1 class="font-display text-[2rem] tracking-display tablet:text-display">{title}</h1>
	</Reveal>

	{#if subtitle}
		<Reveal delay={90}>
			<p class="mt-6 max-w-[600px] text-meta leading-relaxed text-muted-foreground">{subtitle}</p>
		</Reveal>
	{/if}

	<Reveal delay={160}>
		<div class="mt-16 max-w-[840px]">
			<Accordion items={accordionItems}>
				{#snippet panel(item)}
					{answers.get(item.id)}
				{/snippet}
			</Accordion>
		</div>
	</Reveal>
</div>
