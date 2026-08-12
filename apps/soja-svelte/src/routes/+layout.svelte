<script lang="ts">
import "../app.css";
import type { Snippet } from "svelte";
import { onMount } from "svelte";
import { checkout } from "$lib/checkout.svelte";
import Footer from "$lib/components/Footer.svelte";
import Navigation from "$lib/components/Navigation.svelte";
import PoweredByBadge from "$lib/components/PoweredByBadge.svelte";
import { OG_IMAGE, OG_IMAGE_ALT, SITE_NAME, TWITTER_SITE } from "$lib/seo";
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
      // biome-ignore lint/suspicious/noConsole: surface bootstrap failures
      console.error("Storefront bootstrap failed:", error);
    });
});
</script>

<svelte:head>
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:image" content={OG_IMAGE} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={OG_IMAGE_ALT} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={TWITTER_SITE} />
	<meta name="twitter:image" content={OG_IMAGE} />
</svelte:head>

<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-primary focus:px-5 focus:py-3 focus:text-meta focus:text-primary-foreground"
>
	Skip to content
</a>

<div class="flex min-h-svh flex-col bg-background">
	<Navigation categories={data.categories} />
	<div id="main-content" class="flex flex-1 flex-col" tabindex="-1">
		{@render children()}
	</div>
	<Footer />
	<PoweredByBadge />
</div>
