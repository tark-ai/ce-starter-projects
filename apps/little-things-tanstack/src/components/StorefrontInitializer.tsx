import { initCheckout } from "@commercengine/checkout";
import { destroyCheckout } from "@commercengine/checkout/react";
import { useEffect } from "react";
import { ensureClientSessionBootstrapped } from "@/lib/session-bootstrap";
import { storefront, storefrontConfig } from "@/lib/storefront";

/**
 * Canonical client bootstrap for the starter app.
 *
 * 1. Explicitly establishes the storefront session on first load.
 * 2. Initializes hosted checkout with the current SDK tokens.
 * 3. Keeps checkout and storefront tokens synchronized.
 *
 * Public prerendered reads use `storefront.publicStorefront()`.
 * Session-bound flows should rely on this eager bootstrap before they trigger
 * server functions that depend on a persisted session cookie.
 */
export function StorefrontInitializer() {
  useEffect(() => {
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

    void init();

    return () => {
      destroyCheckout();
    };
  }, []);

  return null;
}
