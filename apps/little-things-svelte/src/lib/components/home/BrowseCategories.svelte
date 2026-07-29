<script lang="ts">
import { ArrowRight } from "lucide-svelte";
import type { LittleThingsRoute } from "$lib/little-things-routing";
import { routeToHref } from "$lib/little-things-routing";

interface EditorialItem {
  title: string;
  description: string;
  route: LittleThingsRoute;
  image?: string;
}

interface Props {
  /** Real product image URLs, applied to the tiles in order (2 featured + 3 categories). */
  imageUrls?: string[];
}

let { imageUrls = [] }: Props = $props();

// All editorial tiles link to /all-products (the category slugs below 404 on prerender).
const FEATURED: EditorialItem[] = [
  {
    title: "Everything, dumped here.",
    description:
      "Too lazy to browse categories? We get it. Here's literally everything we sell in one place. Go wild.",
    route: { path: "/all-products" },
  },
  {
    title: "Freshly dropped. Still warm.",
    description: "The newest stuff we could slap a price tag on. Blink and it's gone—probably.",
    route: { path: "/all-products" },
  },
];

const CATEGORIES: EditorialItem[] = [
  {
    title: "Seasonal goods only available online",
    description:
      "Only available online. Only for now. Only if you're fast. Miss it and it's gone till next year—or forever.",
    route: { path: "/all-products" },
  },
  {
    title: "This week's deals",
    description:
      "Blink and you'll miss it. Weekly deals that won't stick around—because good taste moves fast.",
    route: { path: "/all-products" },
  },
  {
    title: "Categories worth scrolling",
    description:
      "From headphones to holograms (eventually), explore all the good stuff by category. Your next obsession is here.",
    route: { path: "/all-products" },
  },
];

const featuredTiles = $derived(
  FEATURED.map((item, i) => ({ ...item, image: imageUrls[i] ?? item.image }))
);
const categoryTiles = $derived(
  CATEGORIES.map((item, i) => ({ ...item, image: imageUrls[FEATURED.length + i] ?? item.image }))
);
</script>

{#snippet tile(item: EditorialItem, imageClass: string)}
	<a href={routeToHref(item.route)} class="group flex flex-col bg-secondary/60 p-8">
		<h3 class="font-display text-2xl italic text-foreground md:text-3xl">{item.title}</h3>
		<p class="mt-3 max-w-md text-sm text-muted-foreground">{item.description}</p>
		<span
			class="mt-6 inline-grid size-10 place-items-center rounded-full border border-border bg-background text-foreground transition-colors group-hover:bg-foreground group-hover:text-background"
		>
			<ArrowRight size={16} />
		</span>
		<div class="mt-8 flex items-end justify-center {imageClass}">
			{#if item.image}
				<img
					src={item.image}
					alt={item.title}
					loading="lazy"
					decoding="async"
					class="h-full w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
				/>
			{/if}
		</div>
	</a>
{/snippet}

<section class="mx-auto w-full max-w-[1400px] px-6 py-12 lg:px-20">
	<div class="grid grid-cols-1 gap-2 md:grid-cols-2">
		{#each featuredTiles as item (item.title)}
			{@render tile(item, "h-96 md:h-[500px]")}
		{/each}
	</div>
	<div class="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
		{#each categoryTiles as item (item.title)}
			{@render tile(item, "h-72 md:h-96")}
		{/each}
	</div>
</section>
