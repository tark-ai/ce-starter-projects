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
 * 1. Explicitly establishes the storefront session on first load.
 * 2. Initializes hosted checkout with the current SDK tokens.
 * 3. Keeps checkout and storefront tokens synchronized.
 * 4. Registers WebMCP agent tools, a no-op in browsers without WebMCP.
 *
 * Public prerendered reads use `storefront.publicStorefront()`.
 * Session-bound flows should rely on this eager bootstrap before they trigger
 * server functions that depend on a persisted session cookie.
 */
export function StorefrontInitializer() {
  const router = useRouter();

  useEffect(() => {
    let agentTools: AbortController | null = null;
    const init = async () => {
      await ensureClientSessionBootstrapped();

      const sdk = storefront.clientStorefront();
      const accessToken = await sdk.getAccessToken();
      const refreshToken = await sdk.session.peekRefreshToken();

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

    void init().then(async () => {
      agentTools = await registerCommerceWebMcp({
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
      });
    });

    return () => {
      agentTools?.abort();
      destroyCheckout();
    };
  }, [router]);

  return null;
}
