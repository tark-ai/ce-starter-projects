<script lang="ts">
import { page } from "$app/state";
import { goto } from "$app/navigation";
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

const BOOTSTRAP_ATTEMPTS = 3;

let agentTools: AbortController | null = null;

onMount(() => {
  let cancelled = false;

  // Pages are prerendered, so a failed bootstrap only costs cart and wishlist.
  // initStorefront clears its cached promise on failure, so retrying recovers
  // them without making the reader reload.
  void (async () => {
    for (let attempt = 0; attempt < BOOTSTRAP_ATTEMPTS; attempt += 1) {
      try {
        await initStorefront();
        if (cancelled) return;
        wishlist.load();
        checkout.init();
        return;
      } catch (error) {
        if (cancelled) return;
        if (attempt === BOOTSTRAP_ATTEMPTS - 1) {
          // biome-ignore lint/suspicious/noConsole: surface bootstrap failures
          console.error("Storefront bootstrap failed:", error);
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt));
        if (cancelled) return;
      }
    }
  })();

  return () => {
    cancelled = true;
  };
    // WebMCP tools, once the session and checkout exist.
    void (async () => {
      const [{ registerCommerceWebMcp }, { createHostedCheckoutBridge }, { getCheckout }, { storefront }, { routes, site }] =
        await Promise.all([
          import("@commercengine/ai/webmcp"),
          import("@commercengine/ai/checkout"),
          import("@commercengine/checkout"),
          import("$lib/storefront"),
          import("$lib/commerce-seo.config"),
        ]);
      agentTools = await registerCommerceWebMcp({
        storefront,
        siteUrl: site.url,
        routes,
        checkout: createHostedCheckoutBridge({ getState: () => getCheckout() }),
        navigation: { navigate: (url) => goto(url) },
        diagnostics: import.meta.env.DEV
          ? (event) => console.info("[commerce-ai]", event.code, event.message ?? "")
          : undefined,
      });
    })();

    return () => agentTools?.abort();
});
</script>

<svelte:head>
	{#if !page.data.seoHead}
		<meta property="og:site_name" content={SITE_NAME} />
		<meta property="og:image" content={OG_IMAGE} />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
		<meta property="og:image:alt" content={OG_IMAGE_ALT} />
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:image" content={OG_IMAGE} />
	{/if}
	<meta name="twitter:site" content={TWITTER_SITE} />
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
