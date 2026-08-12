<script lang="ts">
import {
  readAttributeText,
  type SojaProductDetail,
  splitDescription,
  toAttributeSpecs,
} from "$lib/product-meta";
import Accordion from "../Accordion.svelte";

const INGREDIENT_KEYS = ["ingredients", "ingredient"];

const DEFAULT_SHIPPING_COPY =
  "All orders are shipped from Copenhagen. Complimentary international next-day shipping on all orders above €100. Business days are Monday to Friday, excluding public holidays. Unopened products may be returned within 30 days.";

interface Props {
  product: SojaProductDetail;
  shippingCopy?: string;
}

let { product, shippingCopy = DEFAULT_SHIPPING_COPY }: Props = $props();

const ingredients = $derived(readAttributeText(product.attributes, INGREDIENT_KEYS));
const specs = $derived(toAttributeSpecs(product.attributes, INGREDIENT_KEYS));

// ProductInfo already shows the tagline, so show whatever copy is left here.
const detailBody = $derived(
  product.short_description
    ? (product.description ?? "").trim()
    : splitDescription(product.description).rest
);

const items = $derived(
  [
    detailBody ? { id: "details", label: "Details" } : null,
    specs.length > 0 ? { id: "specifications", label: "Specifications" } : null,
    ingredients ? { id: "ingredients", label: "Ingredients" } : null,
    { id: "shipping", label: "Shipping & returns" },
  ].filter((item): item is { id: string; label: string } => item !== null)
);
</script>

<Accordion {items}>
	{#snippet panel(item)}
		{#if item.id === "details"}
			<p class="whitespace-pre-line">{detailBody}</p>
		{:else if item.id === "specifications"}
			<dl class="grid gap-3">
				{#each specs as spec (spec.key)}
					<div class="flex gap-3">
						<dt class="min-w-32 capitalize text-muted-foreground">{spec.name}</dt>
						<dd class="flex flex-wrap items-center gap-2">
							{#each spec.swatches as swatch (swatch.name)}
								<span
									title={swatch.name}
									aria-hidden="true"
									class="h-3 w-3 border border-black/10"
									style={`background-color:${swatch.hexcode}`}
								></span>
							{/each}
							<span>{spec.value}</span>
						</dd>
					</div>
				{/each}
			</dl>
		{:else if item.id === "ingredients"}
			{ingredients}
		{:else}
			{shippingCopy}
		{/if}
	{/snippet}
</Accordion>
