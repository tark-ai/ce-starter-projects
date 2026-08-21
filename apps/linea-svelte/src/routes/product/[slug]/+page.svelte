<script lang="ts">
import ProductContent from "$lib/components/ProductContent.svelte";
import { SITE_NAME, SITE_URL } from "$lib/seo";

let { data } = $props();

const product = $derived(data.product);
const title = $derived(product.seo?.title || `${product.name} | ${SITE_NAME}`);
const description = $derived(
  product.seo?.description || product.short_description || `Shop ${product.name} from ${SITE_NAME}. Discover timeless elegance with our curated collection of fine jewelry.`,
);
const image = $derived(product.images?.[0]?.url_zoom ?? product.images?.[0]?.url_standard ?? "");
const url = $derived(`${SITE_URL}/product/${product.slug}`);

</script>

<svelte:head>
	<title>{data.seoHead.title}</title>
	{#each data.seoHead.meta as tag}
		{#if tag.property}
			<meta property={tag.property} content={tag.content} />
		{:else}
			<meta name={tag.name} content={tag.content} />
		{/if}
	{/each}
	{#each data.seoHead.links as link}
		<link rel={link.rel} href={link.href} type={link.type} />
	{/each}
	{#each data.seoHead.scripts as script}
		{@html `<script type="${script.type}">${script.content}</script>`}
	{/each}
	{@html `<script type="application/ld+json">${data.breadcrumb}</script>`}
</svelte:head>

<div class="pt-6">
	{#key data.product.id}
		<ProductContent product={data.product} similarItems={data.similarItems} />
	{/key}
</div>
