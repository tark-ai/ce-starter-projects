<script lang="ts">
import ImageZoom from "$lib/components/ImageZoom.svelte";
import StorefrontImage from "$lib/components/StorefrontImage.svelte";

interface Props {
  images: Array<{
    id: string;
    url_standard?: string | null;
    url_zoom?: string | null;
    url_thumbnail?: string | null;
    url_tiny?: string | null;
    alternate_text?: string | null;
  }>;
  productName: string;
}

let { images, productName }: Props = $props();

let currentImageIndex = $state(0);
let isZoomOpen = $state(false);
let zoomInitialIndex = $state(0);

let touchStartX: number | null = null;
let touchEndX: number | null = null;

function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % images.length;
}

function prevImage() {
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
}

function handleImageClick(index: number) {
  zoomInitialIndex = index;
  isZoomOpen = true;
}

function handleTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0].clientX;
}

function handleTouchMove(e: TouchEvent) {
  touchEndX = e.touches[0].clientX;
}

function handleTouchEnd() {
  if (touchStartX === null || touchEndX === null) return;

  const difference = touchStartX - touchEndX;
  const minSwipeDistance = 50;

  if (Math.abs(difference) > minSwipeDistance) {
    if (difference > 0) {
      nextImage();
    } else {
      prevImage();
    }
  }

  touchStartX = null;
  touchEndX = null;
}
</script>

{#if images.length === 0}
	<div class="w-full aspect-square bg-muted/10 flex items-center justify-center">
		<p class="text-sm text-muted-foreground">No images</p>
	</div>
{:else}
	<div class="w-full">
		<!-- Desktop: Vertical scrolling gallery -->
		<div class="hidden lg:block">
			<div class="space-y-4">
				{#each images as image, index (image.id)}
					<button
						type="button"
						class="w-full aspect-square overflow-hidden cursor-pointer group border-0 p-0 bg-transparent"
						onclick={() => handleImageClick(index)}
						aria-label="View {productName} image {index + 1}"
					>
						<StorefrontImage
							{image}
							alt={image.alternate_text || `${productName} view ${index + 1}`}
							variant="standard"
							width={800}
							height={800}
							loading={index === 0 ? 'eager' : 'lazy'}
							class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
						/>
					</button>
				{/each}
			</div>
		</div>

		<!-- Mobile: Image slider -->
		<div class="lg:hidden">
			<div class="relative">
				<button
					type="button"
					class="w-full aspect-square overflow-hidden cursor-pointer group touch-pan-y border-0 p-0 bg-transparent"
					onclick={() => handleImageClick(currentImageIndex)}
					ontouchstart={handleTouchStart}
					ontouchmove={handleTouchMove}
					ontouchend={handleTouchEnd}
					aria-label="View {productName} image {currentImageIndex + 1}"
				>
					<StorefrontImage
						image={images[currentImageIndex]}
						alt={images[currentImageIndex].alternate_text ||
							`${productName} view ${currentImageIndex + 1}`}
						variant="standard"
						width={800}
						height={800}
						loading="eager"
						class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 select-none"
					/>
				</button>

				<!-- Dots indicator -->
				<div class="flex justify-center mt-4 gap-2">
					{#each images as image, index (image.id)}
						<button
							type="button"
							onclick={() => (currentImageIndex = index)}
							class="w-2 h-2 rounded-full transition-colors {index === currentImageIndex
								? 'bg-foreground'
								: 'bg-muted'}"
							aria-label="Go to image {index + 1}"
						></button>
					{/each}
				</div>
			</div>
		</div>

		<ImageZoom
			{images}
			initialIndex={zoomInitialIndex}
			isOpen={isZoomOpen}
			onclose={() => (isZoomOpen = false)}
		/>
	</div>
{/if}
