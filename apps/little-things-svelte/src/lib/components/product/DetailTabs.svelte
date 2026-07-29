<script lang="ts">
import type { Product } from "@commercengine/storefront";
import { Star } from "lucide-svelte";

interface Props {
  product: Product;
}

let { product }: Props = $props();

type DetailTabKey = "details" | "shipping" | "returns" | "reviews";
const TABS: Array<{ key: DetailTabKey; label: string }> = [
  { key: "details", label: "Details" },
  { key: "shipping", label: "Shipping" },
  { key: "returns", label: "Returns" },
  { key: "reviews", label: "Reviews" },
];

let activeTab = $state<DetailTabKey>("details");

const averageRating = $derived(
  product.reviews_count > 0 ? (product.reviews_rating_sum ?? 0) / product.reviews_count : 0
);
const featureBullets = $derived(
  product.attributes.map((attr) => `${attr.name}: ${String(attr.value)}`)
);
</script>

<section class="border-t border-border pt-6">
	<div class="flex gap-8 border-b border-border">
		{#each TABS as tab (tab.key)}
			<button
				type="button"
				onclick={() => (activeTab = tab.key)}
				class="-mb-px border-b-2 pb-3 text-sm font-medium transition-colors {activeTab === tab.key
					? 'border-foreground text-foreground'
					: 'border-transparent text-muted-foreground hover:text-foreground'}"
			>
				{tab.label}
			</button>
		{/each}
	</div>

	<div class="py-8 text-sm leading-relaxed text-muted-foreground">
		{#if activeTab === 'details'}
			<div class="space-y-5">
				<p>
					{product.short_description ||
						'This product is crafted from high-quality materials designed for durability and comfort. It features modern design elements and is perfect for everyday use.'}
				</p>
				{#if featureBullets.length > 0}
					<ul class="space-y-2.5">
						{#each featureBullets as bullet (bullet)}
							<li class="flex items-start gap-3 text-foreground">
								<span class="mt-2 size-1.5 shrink-0 rounded-full bg-brand"></span>
								<span class="capitalize">{bullet}</span>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{:else if activeTab === 'shipping'}
			<div class="space-y-3">
				<p>
					Free standard shipping on all orders above $50. We pack it, we ship it, you refresh the
					tracking page way too many times.
				</p>
				<ul class="list-disc space-y-1 pl-5">
					<li>Standard shipping: 2-5 business days.</li>
					<li>Express shipping available at checkout.</li>
					<li>Tracking emailed the moment it leaves the building.</li>
				</ul>
			</div>
		{:else if activeTab === 'returns'}
			<div class="space-y-3">
				<p>
					Changed your mind? You've got 30 days from purchase to send it back, no interrogation
					required.
				</p>
				<ul class="list-disc space-y-1 pl-5">
					<li>30-day returns on unused items in original packaging.</li>
					<li>Refunds land back on your card within 5-7 business days.</li>
				</ul>
			</div>
		{:else if activeTab === 'reviews'}
			<div class="space-y-6">
				<div class="flex items-center gap-3">
					{#if product.reviews_count > 0}
						<div class="flex items-center gap-1">
							{#each [1, 2, 3, 4, 5] as star (star)}
								<Star
									class="h-4 w-4 {star <= Math.round(averageRating)
										? 'fill-brand text-brand'
										: 'text-muted-foreground/30'}"
								/>
							{/each}
							<span class="ml-1 text-sm text-muted-foreground">
								{averageRating.toFixed(1)} ({product.reviews_count})
							</span>
						</div>
					{:else}
						<p class="text-sm text-muted-foreground">
							No reviews yet. Be the hero this product deserves.
						</p>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</section>
