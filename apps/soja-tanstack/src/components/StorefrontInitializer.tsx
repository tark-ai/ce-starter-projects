import { createHostedCheckoutBridge } from "@commercengine/ai/checkout";
import { registerCommerceWebMcp } from "@commercengine/ai/webmcp";
import { getCheckout, initCheckout } from "@commercengine/checkout";
import { destroyCheckout } from "@commercengine/checkout/react";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { routes, site } from "@/lib/commerce-seo.config";
import { ensureClientSessionBootstrapped } from "@/lib/session-bootstrap";
import { storefront, storefrontConfig } from "@/lib/storefront";

export function StorefrontInitializer() {
  const router = useRouter();

  useEffect(() => {
    let agentTools: AbortController | null = null;
    let active = true;

    // Tool registration only declares capabilities. Session/cart tools already report a retryable
    // not-ready state, so public catalog tools should not wait for anonymous-session bootstrap.
    void registerCommerceWebMcp({
      storefront,
      siteUrl: site.url,
      routes,
      checkout: createHostedCheckoutBridge({ getState: () => getCheckout() }),
      navigation: { navigate: (url) => router.navigate({ href: url }) },
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
