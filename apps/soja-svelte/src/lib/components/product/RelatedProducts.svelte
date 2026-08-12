<script lang="ts">
import type { Item } from "@commercengine/storefront";
import ProductCard from "../ProductCard.svelte";
import Reveal from "../Reveal.svelte";

interface Props {
  items: Item[];
  heading?: string;
}

let { items, heading = "You may also like" }: Props = $props();

const shown = $derived(items.slice(0, 4));
</script>

{#if shown.length > 0}
	<section class="border-t border-border py-20 tablet:py-28">
		<div class="mx-auto w-full max-w-[var(--container-soja)] px-3">
			<Reveal>
				<h2 class="font-display text-title tracking-display">{heading}</h2>
			</Reveal>
		</div>
		<div class="mt-14 grid w-full grid-cols-2 gap-3 px-3 tablet:grid-cols-4">
			{#each shown as item, index (`${item.product_id}-${item.variant_id ?? index}`)}
				<Reveal delay={index * 90}>
					<ProductCard {item} />
				</Reveal>
			{/each}
		</div>
	</section>
{/if}
