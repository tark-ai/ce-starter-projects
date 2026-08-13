<script lang="ts">
import CategoryContent from "$lib/components/category/CategoryContent.svelte";
import { SITE_NAME, SITE_URL } from "$lib/seo";
import { PLP_COPY } from "$lib/site-content";

let { data } = $props();

const TITLE = `${PLP_COPY.title} | ${SITE_NAME}`;
const URL_PATH = `${SITE_URL}/all-products`;
</script>

<svelte:head>
	<title>{TITLE}</title>
	<meta name="description" content={PLP_COPY.subtitle} />
	<link rel="canonical" href={URL_PATH} />
	<meta property="og:title" content={TITLE} />
	<meta property="og:description" content={PLP_COPY.subtitle} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={URL_PATH} />
</svelte:head>

<CategoryContent
	categories={data.categories}
	initialSkus={data.skus}
	initialPagination={data.pagination}
/>
