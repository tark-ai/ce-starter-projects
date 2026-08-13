<script lang="ts">
import { images } from "@ce/soja-ui/lib/images";
import type { Item } from "@commercengine/storefront";
import PhotoBand from "../PhotoBand.svelte";
import ProductCard from "../ProductCard.svelte";

interface Props {
  quote: string;
  author: string;
  featured?: Item;
  image?: string;
}

let { quote, author, featured, image = images.testimonial }: Props = $props();
</script>

<PhotoBand {image} height="band" align="top-left" scrim="soft">
	<figure class="flex max-w-[560px] flex-col gap-5">
		<blockquote class="font-display text-title tracking-display tablet:text-[2rem]">
			&ldquo;{quote}&rdquo;
		</blockquote>
		<figcaption class="text-meta text-white/75">{author}</figcaption>
	</figure>

	{#snippet overlay()}
		{#if featured}
			<ProductCard item={featured} tone="onPhoto" showMeta={false} />
		{/if}
	{/snippet}
</PhotoBand>
