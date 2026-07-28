<script lang="ts">
import type { Item } from "@commercengine/storefront";
import { ArrowRight } from "lucide-svelte";
import type { LittleThingsRoute } from "$lib/little-things-routing";
import { routeToHref } from "$lib/little-things-routing";
import ProductCard from "../ProductCard.svelte";

interface Props {
  title: string;
  items: Item[];
  description?: string;
  seeAllRoute?: LittleThingsRoute;
  seeAllLabel?: string;
}

let { title, items, description, seeAllRoute, seeAllLabel = "See all" }: Props = $props();
</script>

{#if items.length > 0}
	<section class="mx-auto w-full max-w-[1400px] px-6 py-12 lg:px-20">
		<div class="mb-8 flex items-end justify-between gap-4">
			<div>
				<h2 class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{title}</h2>
				{#if description}
					<p class="mt-2 max-w-xl text-sm font-light text-muted-foreground">{description}</p>
				{/if}
			</div>
			{#if seeAllRoute}
				<a
					href={routeToHref(seeAllRoute)}
					class="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-brand transition-opacity hover:opacity-80"
				>
					<span>{seeAllLabel}</span>
					<ArrowRight size={14} />
				</a>
			{/if}
		</div>
		<div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
			{#each items as item (item.sku)}
				<ProductCard {item} />
			{/each}
		</div>
	</section>
{/if}
