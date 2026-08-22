import { createHostedCheckoutBridge } from "@commercengine/ai/checkout";
import { registerCommerceWebMcp } from "@commercengine/ai/webmcp";
import { getCheckout, initCheckout } from "@commercengine/checkout";
import { destroyCheckout } from "@commercengine/checkout/react";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { routes, site } from "@/lib/commerce-seo.config";
import { ensureClientSessionBootstrapped } from "@/lib/session-bootstrap";
import { storefront, storefrontConfig } from "@/lib/storefront";

/**
 * Canonical client bootstrap for the starter app.
 *
 * 1. Registers WebMCP capabilities immediately; session-bound tools report not-ready until step 2.
 * 2. Explicitly establishes the storefront session on first load.
 * 3. Initializes hosted checkout with the current SDK tokens.
 * 4. Keeps checkout and storefront tokens synchronized.
 *
 * Public prerendered reads use `storefront.publicStorefront()`.
 * Session-bound flows should rely on this eager bootstrap before they trigger
 * server functions that depend on a persisted session cookie.
 */
export function StorefrontInitializer() {
  const router = useRouter();

  useEffect(() => {
    let agentTools: AbortController | null = null;
    let active = true;

    void registerCommerceWebMcp({
      storefront,
      siteUrl: site.url,
      routes,
      checkout: createHostedCheckoutBridge({ getState: () => getCheckout() }),
      navigation: { navigate: (url) => router.navigate({ href: url }) },
      // The package reports the outcome; `unsupported` is the ordinary case in a browser
      // without WebMCP, not a fault.
      diagnostics: import.meta.env.DEV
        ? // biome-ignore lint/suspicious/noConsole: development diagnostic
          (event) => console.info("[commerce-ai]", event.code, event.message ?? "")
        : undefined,
    })
      .then((controller) => {
        if (!active) controller?.abort();
        else agentTools = controller;
      })
      .catch((error) => {
        // biome-ignore lint/suspicious/noConsole: surface registration failures
        console.error("Failed to register Commerce Engine agent tools", error);
      });

    const init = async () => {
      await ensureClientSessionBootstrapped();
      if (!active) return;

      const sdk = storefront.clientStorefront();
      const accessToken = await sdk.getAccessToken();
      const refreshToken = await sdk.session.peekRefreshToken();
      if (!active) return;

      initCheckout({
        storeId: storefrontConfig.storeId,
        apiKey: storefrontConfig.apiKey,
        environment: storefrontConfig.environment,
        authMode: "provided",
        accessToken: accessToken ?? undefined,
        refreshToken: refreshToken ?? undefined,
        onTokensUpdated: ({ accessToken, refreshToken }) => {
          void sdk.setTokens(accessToken, refreshToken);
        },
      });
    };

    void init().catch((error) => {
      // biome-ignore lint/suspicious/noConsole: surface bootstrap/checkout init failures
      console.error("Failed to initialize hosted checkout", error);
    });

    return () => {
      active = false;
      agentTools?.abort();
      destroyCheckout();
    };
  }, [router]);

  return null;
}
