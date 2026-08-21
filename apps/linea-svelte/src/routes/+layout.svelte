<script lang="ts">
import "../app.css";
import type { Snippet } from "svelte";
import { goto } from "$app/navigation";
import { page } from "$app/state";
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

let agentTools: AbortController | null = null;

onMount(() => {
  initStorefront().then(async () => {
    wishlist.load();
    checkout.init();

    // WebMCP tools, registered once the session and checkout exist.
    const [{ registerCommerceWebMcp }, { createHostedCheckoutBridge }, { getCheckout }, { storefront }, { routes, site }] =
      await Promise.all([
        import("@commercengine/ai/webmcp"),
        import("@commercengine/ai/checkout"),
        import("@commercengine/checkout"),
        import("$lib/storefront"),
        import("$lib/seo-config"),
      ]);
    agentTools = await registerCommerceWebMcp({
      storefront,
      siteUrl: site.url,
      routes,
      checkout: createHostedCheckoutBridge({ getState: () => getCheckout() }),
      navigation: { navigate: (url) => goto(url) },
    });
  });

  return () => agentTools?.abort();
});
</script>

<svelte:head>
	{#if !page.data.seoHead}
		<meta property="og:site_name" content={SITE_NAME} />
		<meta property="og:image" content={OG_IMAGE} />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
		<meta name="twitter:card" content="summary_large_image" />
	{/if}
	<meta name="twitter:site" content={TWITTER_SITE} />
</svelte:head>

<Navigation categories={data.categories} />
<main class="min-h-screen">
	{@render children()}
</main>
<Footer />
<PoweredByBadge />
