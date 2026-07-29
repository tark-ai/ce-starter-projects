<script lang="ts">
import "../app.css";
import type { Snippet } from "svelte";
import { onMount } from "svelte";
import { checkout } from "$lib/checkout.svelte";
import Footer from "$lib/components/Footer.svelte";
import Navigation from "$lib/components/Navigation.svelte";
import PoweredByBadge from "$lib/components/PoweredByBadge.svelte";
import { OG_IMAGE, SITE_NAME, TWITTER_SITE } from "$lib/seo";
import { initStorefront } from "$lib/storefront";
import { wishlist } from "$lib/wishlist.svelte";
import type { LayoutData } from "./$types";

let { data, children }: { data: LayoutData; children: Snippet } = $props();

onMount(() => {
  initStorefront()
    .then(() => {
      wishlist.load();
      checkout.init();
    })
    .catch((error) => {
      // Surface the failure instead of leaving an unhandled rejection; cart and
      // wishlist will simply be unavailable until the next successful init.
      console.error("Storefront bootstrap failed:", error);
    });
});
</script>

<svelte:head>
	<meta property="og:site_name" content={SITE_NAME} />
	{#if OG_IMAGE}
		<meta property="og:image" content={OG_IMAGE} />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
	{/if}
	<meta name="twitter:card" content={OG_IMAGE ? 'summary_large_image' : 'summary'} />
	<meta name="twitter:site" content={TWITTER_SITE} />
</svelte:head>

<Navigation categories={data.categories} />
<main class="min-h-screen">
	{@render children()}
</main>
<Footer />
<PoweredByBadge />
