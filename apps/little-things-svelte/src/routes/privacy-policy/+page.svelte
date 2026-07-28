<script lang="ts">
import PrivacyPolicyContent from "$lib/components/legal/PrivacyPolicyContent.svelte";
import { SITE_NAME, SITE_URL } from "$lib/seo";
</script>

<svelte:head>
	<title>Privacy Policy | {SITE_NAME}</title>
	<meta name="description" content="How Little Things collects, uses, and protects your data." />
	<link rel="canonical" href={`${SITE_URL}/privacy-policy`} />
</svelte:head>

<PrivacyPolicyContent />
