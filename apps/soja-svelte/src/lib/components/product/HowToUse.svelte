<script lang="ts">
import { cn } from "$lib/utils";
import Reveal from "../Reveal.svelte";

const STEPS = [
  {
    letter: "A.",
    text: "Wet your face with warm water and towel dry softly to remove excess water.",
  },
  {
    letter: "B.",
    text: "Apply a chickpea-sized portion of the facial serum to your skin and spread evenly.",
  },
  {
    letter: "C.",
    text: "Rest, relax and let your face absorb the serum for up to six hours before removing with warm water.",
  },
];
</script>

<section class="border-t border-border py-20 tablet:py-28">
	<div class="mx-auto w-full max-w-[var(--container-soja)] px-3">
		<Reveal>
			<h2 class="font-display text-title tracking-display">How to use</h2>
		</Reveal>
		<div class="mt-14 grid gap-12 tablet:grid-cols-3 tablet:gap-8">
			{#each STEPS as step, index (step.letter)}
				<Reveal
					delay={index * 110}
					class={cn(
						"flex flex-col tablet:px-8",
						index > 0 && "tablet:border-l tablet:border-border",
						index === 0 && "tablet:pl-0"
					)}
				>
					<span class="text-meta text-muted-foreground">{step.letter}</span>
					<p class="mt-6 max-w-[280px] text-meta leading-relaxed">{step.text}</p>
				</Reveal>
			{/each}
		</div>
	</div>
</section>
