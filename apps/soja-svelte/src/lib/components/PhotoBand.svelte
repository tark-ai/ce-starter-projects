<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "$lib/utils";

type Height = "natural" | "screen" | "band" | "auto";
type Align = "top-left" | "bottom-left" | "bottom-right" | "center";

const HEIGHTS: Record<Height, string> = {
  natural: "",
  // dvh, not vh: it settles as mobile browser chrome collapses.
  screen: "min-h-dvh",
  band: "min-h-[85svh]",
  auto: "",
};

const ALIGNMENTS: Record<Align, string> = {
  "top-left": "items-start justify-start text-left",
  "bottom-left": "items-start justify-end text-left",
  "bottom-right": "items-end justify-end text-left",
  center: "items-center justify-center text-center",
};

const SCRIMS = {
  none: "",
  soft: "bg-gradient-to-t from-black/40 via-black/10 to-transparent",
  strong: "bg-black/40",
} as const;

interface Props {
  image: string;
  alt?: string;
  height?: Height;
  align?: Align;
  scrim?: keyof typeof SCRIMS;
  children?: Snippet;
  overlay?: Snippet;
  class?: string;
  contentClass?: string;
}

let {
  image,
  alt = "",
  height = "band",
  align = "bottom-left",
  scrim = "none",
  children,
  overlay,
  class: className = "",
  contentClass = "",
}: Props = $props();

const isBottomAligned = $derived(align === "bottom-left" || align === "bottom-right");
const isPriority = $derived(height === "screen");
</script>

<section class={cn("relative w-full overflow-hidden bg-foreground", HEIGHTS[height], className)}>
	<img
		src={image}
		{alt}
		aria-hidden={alt === "" ? "true" : undefined}
		class="absolute inset-0 h-full w-full object-cover object-center"
		loading={isPriority ? "eager" : "lazy"}
		fetchpriority={isPriority ? "high" : undefined}
		decoding="async"
	/>

	{#if scrim !== "none"}
		<div aria-hidden="true" class={cn("absolute inset-0", SCRIMS[scrim])}></div>
	{/if}

	{#if children}
		<div class={cn("relative flex w-full flex-col", HEIGHTS[height], ALIGNMENTS[align])}>
			<div
				class={cn(
					"soja-container w-full py-16 text-white tablet:py-24",
					isBottomAligned && "sticky bottom-12",
					contentClass
				)}
			>
				{@render children()}
			</div>
		</div>
	{/if}

	{#if overlay}
		<div
			class="absolute right-0 bottom-0 z-10 w-[60%] max-w-[460px] translate-y-[10%] pr-3 tablet:w-[32%] tablet:pr-15"
		>
			{@render overlay()}
		</div>
	{/if}
</section>
