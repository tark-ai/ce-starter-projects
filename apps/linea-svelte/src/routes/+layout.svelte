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

let { data, children }: { data: any; children: Snippet } = $props();

onMount(() => {
  initStorefront().then(() => {
    wishlist.load();
    checkout.init();
  });
});
</script>

<svelte:head>
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:image" content={OG_IMAGE} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={TWITTER_SITE} />
</svelte:head>

<Navigation categories={data.categories} />
<main class="min-h-screen">
	{@render children()}
</main>
<Footer />
<PoweredByBadge />
