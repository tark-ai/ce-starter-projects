<script lang="ts">
import type { LittleThingsRoute } from "$lib/little-things-routing";
import { routeToHref } from "$lib/little-things-routing";

interface Props {
  serifLine?: string;
  sansLine?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaRoute?: LittleThingsRoute;
}

let {
  serifLine = "Because basic is boring.",
  sansLine = "Upgrade your life.",
  subtitle = "Turn your boring routine into a highlight reel — you're welcome.",
  ctaLabel = "Browse all products",
  ctaRoute = { path: "/all-products" },
}: Props = $props();
</script>

<section class="mx-auto w-full max-w-[1400px] px-6 pb-12 pt-16 lg:px-20 lg:pt-32">
	<h1 class="max-w-4xl leading-[0.95]">
		<span class="block font-display text-5xl italic md:text-7xl">{serifLine}</span>
		<span class="mt-1 block text-5xl font-bold tracking-tight md:text-7xl">{sansLine}</span>
	</h1>
	<div class="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
		<p class="max-w-sm text-lg text-muted-foreground">{subtitle}</p>
		<a
			href={routeToHref(ctaRoute)}
			class="inline-flex h-12 items-center self-start rounded-full bg-secondary px-8 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent md:self-auto"
		>
			{ctaLabel}
		</a>
	</div>
</section>
