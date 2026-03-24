<script lang="ts">
import { X } from "lucide-svelte";
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
  initialIndex: number;
  isOpen: boolean;
  onclose: () => void;
}

let { images, initialIndex, isOpen, onclose }: Props = $props();

let scrollContainer: HTMLDivElement | undefined = $state();

$effect(() => {
  if (!isOpen) return;

  function handleEscKey(event: KeyboardEvent) {
    if (event.key === "Escape") {
      onclose();
    }
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
    const imageElement = scrollContainer.children[0]?.children[initialIndex] as
      | HTMLElement
      | undefined;
    if (imageElement) {
      imageElement.scrollIntoView();
    }
  }
});
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm animate-fade-in">
		<button
			type="button"
			class="absolute inset-0 border-0 p-0 cursor-pointer bg-transparent"
			onclick={onclose}
			aria-label="Close image zoom"
		></button>
		<button
			type="button"
			onclick={onclose}
			class="absolute top-6 right-6 z-10 hover:bg-transparent text-black border-none p-2 cursor-pointer bg-transparent"
			aria-label="Close"
		>
			<X class="h-8 w-8" />
		</button>
		<div bind:this={scrollContainer} class="relative w-full h-full overflow-y-auto">
			<div class="space-y-4">
				{#each images as image (image.id)}
					<div class="w-full flex justify-center">
						<StorefrontImage
							{image}
							alt={image.alternate_text || 'Product view'}
							variant="zoom"
							width={1200}
							height={1200}
							class="w-full max-w-none object-cover animate-scale-in"
						/>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
