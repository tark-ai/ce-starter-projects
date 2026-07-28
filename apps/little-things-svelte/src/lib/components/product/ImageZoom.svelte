<script lang="ts">
import type { ProductImage } from "@commercengine/storefront";
import { X } from "lucide-svelte";
import StorefrontImage from "../StorefrontImage.svelte";

interface Props {
  images: ProductImage[];
  initialIndex: number;
  isOpen: boolean;
  onclose: () => void;
}

let { images, initialIndex, isOpen, onclose }: Props = $props();

let scrollContainer: HTMLDivElement | undefined = $state();

$effect(() => {
  if (!isOpen) return;

  function handleEscKey(event: KeyboardEvent) {
    if (event.key === "Escape") onclose();
  }

  document.addEventListener("keydown", handleEscKey);
  document.body.style.overflow = "hidden";

  return () => {
    document.removeEventListener("keydown", handleEscKey);
    document.body.style.overflow = "unset";
  };
});

$effect(() => {
  if (isOpen && scrollContainer) {
    const el = scrollContainer.children[0]?.children[initialIndex] as HTMLElement | undefined;
    if (el) el.scrollIntoView();
  }
});
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm animate-fade-in">
		<button
			type="button"
			class="absolute inset-0 cursor-pointer border-0 bg-transparent p-0"
			onclick={onclose}
			aria-label="Close image zoom"
		></button>
		<button
			type="button"
			onclick={onclose}
			class="absolute right-6 top-6 z-10 border-none bg-transparent p-2 text-white hover:bg-transparent"
			aria-label="Close"
		>
			<X class="h-8 w-8" />
		</button>
		<div bind:this={scrollContainer} class="relative h-full w-full overflow-y-auto">
			<div class="space-y-4">
				{#each images as image (image.id)}
					<div class="flex w-full justify-center">
						<StorefrontImage
							{image}
							alt={image.alternate_text || 'Product view'}
							variant="zoom"
							width={1200}
							height={1200}
							class="w-full max-w-3xl object-contain"
						/>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
