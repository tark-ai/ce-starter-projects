<script lang="ts">
import FaqAccordion from "$lib/components/faq/FaqAccordion.svelte";
import { SITE_NAME, SITE_URL } from "$lib/seo";
import { FAQ_ITEMS } from "$lib/site-content";

const TITLE = `FAQs | ${SITE_NAME}`;
const SUBTITLE =
  "Everything about shipping, shelf life and using our formulations. If your question isn't here, write to us.";
const DESCRIPTION = `Frequently asked questions about ${SITE_NAME} — shipping, shelf life, sensitivities and use.`;
const PAGE_URL = `${SITE_URL}/faq`;
</script>

<svelte:head>
	<title>{TITLE}</title>
	<meta name="description" content={DESCRIPTION} />
	<link rel="canonical" href={PAGE_URL} />
	<meta property="og:title" content={TITLE} />
	<meta property="og:description" content={SUBTITLE} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={PAGE_URL} />
</svelte:head>

<main>
	<FaqAccordion items={FAQ_ITEMS} title="FAQs" subtitle={SUBTITLE} />
</main>
