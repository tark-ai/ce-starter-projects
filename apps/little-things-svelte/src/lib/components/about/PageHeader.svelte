<script lang="ts">
import type { LittleThingsRoute } from "$lib/little-things-routing";
import { routeToHref } from "$lib/little-things-routing";

interface Props {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaRoute?: LittleThingsRoute;
}

let { title, subtitle, ctaLabel, ctaRoute }: Props = $props();
</script>

<header class="w-full border-b border-border px-6 py-20 md:py-28">
	<div class="mx-auto max-w-3xl">
		<h1 class="text-4xl font-bold tracking-tight text-foreground md:text-5xl">{title}</h1>
		{#if subtitle}
			<p class="mt-6 text-lg font-light leading-relaxed text-muted-foreground">{subtitle}</p>
		{/if}
		{#if ctaLabel && ctaRoute}
			<div class="mt-8">
				<a
					href={routeToHref(ctaRoute)}
					class="inline-flex h-12 items-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
				>
					{ctaLabel}
				</a>
			</div>
		{/if}
	</div>
</header>
