<script lang="ts">
import CategoryContent from "$lib/components/category/CategoryContent.svelte";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from "$lib/seo";

let { data } = $props();

const title = `All products | ${SITE_NAME}`;
const url = `${SITE_URL}/all-products`;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={DEFAULT_DESCRIPTION} />
	<link rel="canonical" href={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={DEFAULT_DESCRIPTION} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={url} />
</svelte:head>

<CategoryContent
	displayName="All products"
	categorySlug={null}
	initialSkus={data.skus}
	initialPagination={data.pagination}
/>
