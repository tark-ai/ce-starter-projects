<script lang="ts">
import type { Item } from "@commercengine/storefront";
import type { SojaRoute } from "$lib/soja-routing";
import EyebrowLink from "../EyebrowLink.svelte";
import ProductCard from "../ProductCard.svelte";
import Reveal from "../Reveal.svelte";
import SectionLede from "../SectionLede.svelte";

interface Cta {
  label: string;
  route: SojaRoute;
  image?: string;
  imageAlt?: string;
}

interface Props {
  items: Item[];
  lede: string;
  eyebrow?: { label: string; route: SojaRoute };
  ctas?: Cta[];
  limit?: number;
}

let { items, lede, eyebrow, ctas = [], limit = 4 }: Props = $props();

const shown = $derived(items.slice(0, limit));
const hasTiles = $derived(ctas.some((cta) => cta.image));
</script>

<section class="py-20 tablet:py-28">
	<div class="soja-container flex flex-col gap-6">
		{#if eyebrow}
			<Reveal>
				<EyebrowLink
					label={eyebrow.label}
					route={eyebrow.route}
					class="text-muted-foreground"
				/>
			</Reveal>
		{/if}
		<Reveal delay={80}>
			<SectionLede>{lede}</SectionLede>
		</Reveal>
	</div>

	{#if shown.length > 0}
		<div class="mt-16 grid w-full grid-cols-2 gap-3 px-3 tablet:mt-24 tablet:grid-cols-4">
			{#each shown as item, index (`${item.product_id}-${item.variant_id ?? index}`)}
				<Reveal delay={index * 90}>
					<ProductCard {item} />
				</Reveal>
			{/each}
		</div>
	{/if}

	{#if ctas.length > 0}
		{#if hasTiles}
			<div class="mt-20 grid w-full grid-cols-1 gap-3 px-3 pb-4 tablet:mt-28 sm:grid-cols-2">
				{#each ctas as cta, index (cta.label)}
					<Reveal delay={index * 90}>
						<a href={cta.route.path} class="group block">
							<span
								class="mb-5 inline-flex items-center gap-2 text-meta transition-opacity duration-300 ease-soja group-hover:opacity-60"
							>
								{cta.label}
								<span
									aria-hidden="true"
									class="h-1.5 w-1.5 bg-current transition-transform duration-500 ease-soja group-hover:translate-x-1"
								></span>
							</span>
							<div class="relative aspect-2/3 overflow-hidden bg-accent">
								{#if cta.image}
									<img
										src={cta.image}
										alt={cta.imageAlt ?? ""}
										aria-hidden={cta.imageAlt ? undefined : "true"}
										loading="lazy"
										decoding="async"
										class="h-full w-full object-cover transition-transform duration-[1200ms] ease-soja group-hover:scale-[1.04]"
									/>
								{/if}
							</div>
						</a>
					</Reveal>
				{/each}
			</div>
		{:else}
			<div class="soja-container mt-12 flex flex-wrap gap-x-10 gap-y-4">
				{#each ctas as cta (cta.label)}
					<EyebrowLink label={cta.label} route={cta.route} />
				{/each}
			</div>
		{/if}
	{/if}
</section>
