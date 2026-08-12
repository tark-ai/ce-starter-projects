<script lang="ts">
import { images } from "@ce/soja-ui/lib/images";
import type { SojaRoute } from "$lib/soja-routing";
import EyebrowLink from "../EyebrowLink.svelte";
import PhotoBand from "../PhotoBand.svelte";

interface Props {
  title: string;
  body: string;
  ctaLabel: string;
  ctaRoute?: SojaRoute;
  image?: string;
}

let {
  title,
  body,
  ctaLabel,
  ctaRoute = { path: "/all-products" },
  image = images.hero,
}: Props = $props();

const words = $derived(title.split(" "));
</script>

<PhotoBand
	{image}
	height="screen"
	class="max-h-dvh"
	align="bottom-right"
	scrim="soft"
	contentClass="flex justify-end"
>
	<div class="flex max-w-[420px] flex-col gap-6">
		<h1 class="font-display text-[2.5rem] tracking-display tablet:text-display">
			{#each words as word, index (index)}
				<!-- The space stays outside the clipping box: inside, CSS trims it as
				     trailing white space and the words render jammed together. -->
				<span class="inline-block overflow-hidden align-bottom">
					<span class="inline-block animate-rise" style={`animation-delay:${200 + index * 90}ms`}>
						{word}
					</span>
				</span>{#if index < words.length - 1}{" "}{/if}
			{/each}
		</h1>

		<p class="animate-rise-slow text-meta leading-relaxed text-white/85" style="animation-delay:620ms">
			{body}
		</p>

		<div class="animate-rise-slow" style="animation-delay:760ms">
			<EyebrowLink label={ctaLabel} route={ctaRoute} />
		</div>
	</div>
</PhotoBand>
