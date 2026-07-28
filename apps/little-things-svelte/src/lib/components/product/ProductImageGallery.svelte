<script lang="ts">
import type { ProductImage } from "@commercengine/storefront";
import StorefrontImage from "../StorefrontImage.svelte";
import ImageZoom from "./ImageZoom.svelte";

interface Props {
  images: ProductImage[];
  productName: string;
}

let { images, productName }: Props = $props();

let currentImageIndex = $state(0);
let isZoomOpen = $state(false);

const activeImage = $derived(images[currentImageIndex] ?? images[0]);

$effect(() => {
  const maxIndex = images.length - 1;
  if (maxIndex < 0) {
    currentImageIndex = 0;
    isZoomOpen = false;
    return;
  }
  if (currentImageIndex > maxIndex) currentImageIndex = maxIndex;
});
</script>

{#if images.length === 0}
	<div class="flex aspect-square w-full items-center justify-center bg-secondary">
		<p class="text-sm text-muted-foreground">No image</p>
	</div>
{:else}
	<div class="w-full">
		<div class="flex gap-4">
			<!-- Vertical thumbnail column (desktop) -->
			{#if images.length > 1}
				<div class="hidden w-20 shrink-0 flex-col gap-3 lg:flex">
					{#each images as image, index (image.id)}
						<button
							type="button"
							onclick={() => (currentImageIndex = index)}
							class="flex aspect-square items-center justify-center overflow-hidden bg-secondary p-2 transition-all {index ===
							currentImageIndex
								? 'ring-2 ring-brand'
								: 'opacity-70 hover:opacity-100'}"
							aria-label={`Show ${productName} image ${index + 1}`}
						>
							<StorefrontImage
								{image}
								alt={image.alternate_text || `${productName} thumbnail ${index + 1}`}
								variant="thumbnail"
								width={120}
								height={120}
								class="h-full w-full object-contain"
							/>
						</button>
					{/each}
				</div>
			{/if}

			<!-- Main image -->
			<button
				type="button"
				class="group flex aspect-square flex-1 items-center justify-center overflow-hidden border-0 bg-secondary p-3 md:p-4"
				onclick={() => (isZoomOpen = true)}
				aria-label={`Zoom ${productName}`}
			>
				<StorefrontImage
					image={activeImage}
					alt={activeImage.alternate_text || productName}
					variant="standard"
					width={900}
					height={900}
					loading="eager"
					fetchpriority="high"
					class="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
				/>
			</button>
		</div>

		<!-- Mobile: horizontal thumbnail strip -->
		{#if images.length > 1}
			<div class="mt-3 flex gap-2.5 overflow-x-auto px-1 py-1 lg:hidden">
				{#each images as image, index (image.id)}
					<button
						type="button"
						onclick={() => (currentImageIndex = index)}
						class="flex size-16 shrink-0 items-center justify-center overflow-hidden bg-secondary p-1.5 transition-all {index ===
						currentImageIndex
							? 'ring-2 ring-brand'
							: 'opacity-70 hover:opacity-100'}"
						aria-label={`Show ${productName} image ${index + 1}`}
					>
						<StorefrontImage
							{image}
							alt={image.alternate_text || `${productName} thumbnail ${index + 1}`}
							variant="thumbnail"
							width={96}
							height={96}
							class="h-full w-full object-contain"
						/>
					</button>
				{/each}
			</div>
		{/if}

		<ImageZoom
			{images}
			initialIndex={currentImageIndex}
			isOpen={isZoomOpen}
			onclose={() => (isZoomOpen = false)}
		/>
	</div>
{/if}
