<script lang="ts">
import AboutContent from "$lib/components/about/AboutContent.svelte";
import { SITE_NAME, SITE_URL } from "$lib/seo";
import { ABOUT_COPY } from "$lib/site-content";

const TITLE = `Behind the brand | ${SITE_NAME}`;
const DESCRIPTION = ABOUT_COPY.subtitle;
const CANONICAL = `${SITE_URL}/about`;
const PAGE_URL = `${SITE_URL}/our-story`;
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

<AboutContent />
