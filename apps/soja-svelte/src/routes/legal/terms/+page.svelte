<script lang="ts">
import TermsContent from "$lib/components/legal/TermsContent.svelte";
import { SITE_NAME, SITE_URL } from "$lib/seo";

const TITLE = `Terms of Service | ${SITE_NAME}`;
const DESCRIPTION = `The terms that govern your use of the ${SITE_NAME} website and the purchase of our products.`;
const CANONICAL = `${SITE_URL}/terms-of-service`;
const PAGE_URL = `${SITE_URL}/legal/terms`;
</script>

<svelte:head>
	<title>{TITLE}</title>
	<meta name="description" content={DESCRIPTION} />
	<!-- Alias: canonical points at the primary route so the duplicate consolidates. -->
	<link rel="canonical" href={CANONICAL} />
	<meta property="og:title" content={TITLE} />
	<meta property="og:description" content={DESCRIPTION} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={PAGE_URL} />
</svelte:head>

<TermsContent />
