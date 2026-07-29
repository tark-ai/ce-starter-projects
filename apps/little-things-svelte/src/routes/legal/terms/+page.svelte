<script lang="ts">
import TermsOfServiceContent from "$lib/components/legal/TermsOfServiceContent.svelte";
import { SITE_NAME, SITE_URL } from "$lib/seo";
</script>

<svelte:head>
	<title>Terms of Service | {SITE_NAME}</title>
	<meta name="description" content="The terms that govern your use of Little Things." />
	<link rel="canonical" href={`${SITE_URL}/terms-of-service`} />
</svelte:head>

<TermsOfServiceContent />
