<script lang="ts">
import type { Product } from "@commercengine/storefront";
import { ChevronDown, ChevronUp } from "lucide-svelte";
import ReviewProduct from "$lib/components/ReviewProduct.svelte";

interface Props {
  product: Product;
}

let { product }: Props = $props();

let isDescriptionOpen = $state(false);
let isDetailsOpen = $state(false);
let isCareOpen = $state(false);
let isReviewsOpen = $state(false);

const averageRating = $derived(
  product.reviews_count > 0 ? product.reviews_rating_sum / product.reviews_count : 0
);
</script>

<div class="space-y-0 mt-8 border-t border-border">
	<!-- Description -->
	{#if product.short_description}
		<div class="border-b border-border">
			<button
				type="button"
				onclick={() => (isDescriptionOpen = !isDescriptionOpen)}
				class="w-full h-14 px-0 flex items-center justify-between hover:bg-transparent font-light"
			>
				<span>Description</span>
				{#if isDescriptionOpen}
					<ChevronUp class="h-4 w-4" />
				{:else}
					<ChevronDown class="h-4 w-4" />
				{/if}
			</button>
			{#if isDescriptionOpen}
				<div class="pb-6 space-y-4">
					<p class="text-sm font-light text-muted-foreground leading-relaxed">
						{product.short_description}
					</p>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Product Details -->
	<div class="border-b border-border">
		<button
			type="button"
			onclick={() => (isDetailsOpen = !isDetailsOpen)}
			class="w-full h-14 px-0 flex items-center justify-between hover:bg-transparent font-light"
		>
			<span>Product Details</span>
			{#if isDetailsOpen}
				<ChevronUp class="h-4 w-4" />
			{:else}
				<ChevronDown class="h-4 w-4" />
			{/if}
		</button>
		{#if isDetailsOpen}
			<div class="pb-6 space-y-3">
				{#if product.sku}
					<div class="flex justify-between">
						<span class="text-sm font-light text-muted-foreground">SKU</span>
						<span class="text-sm font-light text-foreground">{product.sku}</span>
					</div>
				{/if}
				{#each product.attributes as attr (attr.key)}
					<div class="flex justify-between">
						<span class="text-sm font-light text-muted-foreground capitalize">{attr.name}</span>
						<span class="text-sm font-light text-foreground">{String(attr.value)}</span>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Care & Cleaning -->
	<div class="border-b border-border">
		<button
			type="button"
			onclick={() => (isCareOpen = !isCareOpen)}
			class="w-full h-14 px-0 flex items-center justify-between hover:bg-transparent font-light"
		>
			<span>Care & Cleaning</span>
			{#if isCareOpen}
				<ChevronUp class="h-4 w-4" />
			{:else}
				<ChevronDown class="h-4 w-4" />
			{/if}
		</button>
		{#if isCareOpen}
			<div class="pb-6 space-y-4">
				<ul class="space-y-2">
					<li class="text-sm font-light text-muted-foreground">
						- Clean with a soft, dry cloth after each wear
					</li>
					<li class="text-sm font-light text-muted-foreground">
						- Avoid contact with perfumes, lotions, and cleaning products
					</li>
					<li class="text-sm font-light text-muted-foreground">
						- Store in the provided jewelry pouch when not wearing
					</li>
					<li class="text-sm font-light text-muted-foreground">
						- Remove before swimming, exercising, or showering
					</li>
				</ul>
			</div>
		{/if}
	</div>

	<!-- Customer Reviews -->
	<div class="border-b border-border lg:mb-16">
		<button
			type="button"
			onclick={() => (isReviewsOpen = !isReviewsOpen)}
			class="w-full h-14 px-0 flex items-center justify-between hover:bg-transparent font-light"
		>
			<div class="flex items-center gap-3">
				<span>Customer Reviews</span>
				{#if product.reviews_count > 0}
					<div class="flex items-center">
						{#each [1, 2, 3, 4, 5] as star (star)}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								class="w-3 h-3 {star <= Math.round(averageRating)
									? 'text-foreground'
									: 'text-muted-foreground/30'}"
								role="img"
								aria-label={star <= Math.round(averageRating) ? 'Filled star' : 'Empty star'}
							>
								<path
									fill-rule="evenodd"
									d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
									clip-rule="evenodd"
								/>
							</svg>
						{/each}
						<span class="text-sm font-light text-muted-foreground ml-1">
							{averageRating.toFixed(1)}
						</span>
					</div>
				{/if}
			</div>
			{#if isReviewsOpen}
				<ChevronUp class="h-4 w-4" />
			{:else}
				<ChevronDown class="h-4 w-4" />
			{/if}
		</button>
		{#if isReviewsOpen}
			<div class="pb-6 space-y-6">
				<ReviewProduct />
				{#if product.reviews_count === 0}
					<p class="text-sm font-light text-muted-foreground">
						No reviews yet. Be the first to review this product.
					</p>
				{/if}
			</div>
		{/if}
	</div>
</div>
