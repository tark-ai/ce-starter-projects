<script lang="ts">
import type { ProductImage } from "@commercengine/storefront";
import { cn } from "$lib/utils";
import StorefrontImage from "../StorefrontImage.svelte";

interface Props {
  images: ProductImage[];
  productName: string;
}

let { images, productName }: Props = $props();

let active = $state(0);

// Reset when handed a different variant's images.
$effect(() => {
  images;
  active = 0;
});

const gallery = $derived(images ?? []);
const current = $derived(gallery[Math.min(active, gallery.length - 1)]);
</script>

{#if gallery.length === 0}
	<div class="aspect-2/3 w-full bg-accent"></div>
{:else}
	<!-- min-w-0 throughout: without it the thumbnail strip widens its ancestors
	     instead of scrolling. -->
	<div class="flex min-w-0 flex-col gap-3 tablet:flex-row">
		<div class="min-w-0 flex-1 overflow-hidden bg-accent">
			{#key active}
				<StorefrontImage
					image={current}
					alt={current?.alternate_text || productName}
					variant="zoom"
					loading="eager"
					class="aspect-2/3 w-full animate-fade-in object-cover"
				/>
			{/key}
		</div>

		{#if gallery.length > 1}
			<div
				class="no-scrollbar flex min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto tablet:order-first tablet:w-20 tablet:shrink-0 tablet:flex-col tablet:snap-none tablet:overflow-x-visible"
			>
				{#each gallery as image, index (image.url_thumbnail ?? image.url_standard ?? index)}
					<button
						type="button"
						onclick={() => (active = index)}
						aria-label={`View image ${index + 1} of ${gallery.length}`}
						aria-current={index === active}
						class={cn(
							"relative aspect-2/3 w-[4.5rem] shrink-0 snap-start overflow-hidden bg-accent transition-opacity duration-300 ease-soja tablet:w-full",
							index === active
								? "opacity-100 ring-1 ring-foreground ring-inset"
								: "opacity-50 hover:opacity-80"
						)}
					>
						<StorefrontImage
							{image}
							alt=""
							variant="thumbnail"
							class="h-full w-full object-cover"
						/>
					</button>
				{/each}
			</div>
		{/if}
	</div>
{/if}
