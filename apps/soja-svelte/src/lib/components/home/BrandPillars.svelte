<script lang="ts">
import { images } from "@ce/soja-ui/lib/images";
import { cn } from "$lib/utils";
import Reveal from "../Reveal.svelte";

const PILLARS = [
  {
    numeral: "I.",
    claim: "Complimentary international next-day shipping on all order above €100",
    image: images.pillarShipping,
    imageAlt: "Soja packaging resting on a river stone",
  },
  {
    numeral: "II.",
    claim: "Every product is arranged in our exquisite 100% recycled packaging",
    image: images.pillarPackaging,
    imageAlt: "Hands applying Soja product",
  },
  {
    numeral: "III.",
    claim: "Founded and operated out of beautiful Copenhagen, Denmark",
    image: images.pillarCopenhagen,
    imageAlt: "Portrait of a member of the Soja team",
  },
  {
    numeral: "IV.",
    claim: "We are committed to using ethically-sourced ingredients for all products",
    image: images.pillarSourcing,
    imageAlt: "Sea kelp beneath the water's surface",
  },
];
</script>

<section class="py-24 tablet:py-36">
	<div
		class="soja-container grid grid-cols-1 gap-x-0 gap-y-12 sm:grid-cols-2 sm:gap-y-16 tablet:grid-cols-4"
	>
		{#each PILLARS as pillar, index (pillar.numeral)}
			<Reveal
				delay={index * 110}
				class={cn(
					"flex flex-row items-start gap-6 sm:flex-col sm:gap-0 tablet:px-8",
					index > 0 && "tablet:border-l tablet:border-border",
					index === 0 && "tablet:pl-0",
					index === PILLARS.length - 1 && "tablet:pr-0"
				)}
			>
				<div class="flex-1 sm:flex-none">
					<span class="text-meta text-muted-foreground">{pillar.numeral}</span>
					<p class="mt-6 max-w-[240px] text-meta leading-relaxed sm:mt-8">{pillar.claim}</p>
				</div>
				<img
					src={pillar.image}
					alt={pillar.imageAlt}
					loading="lazy"
					decoding="async"
					class="aspect-2/3 w-[38%] shrink-0 object-cover sm:mt-14 sm:w-full sm:max-w-[230px]"
				/>
			</Reveal>
		{/each}
	</div>
</section>
