<script lang="ts">
import PrivacyContent from "$lib/components/legal/PrivacyContent.svelte";
import { SITE_NAME, SITE_URL } from "$lib/seo";

const TITLE = `Privacy Policy | ${SITE_NAME}`;
const DESCRIPTION = `How ${SITE_NAME} collects, uses, discloses and safeguards your personal information.`;
const CANONICAL = `${SITE_URL}/privacy-policy`;
const PAGE_URL = `${SITE_URL}/legal/privacy`;
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

<PrivacyContent />
