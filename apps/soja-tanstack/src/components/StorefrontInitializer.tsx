import { initCheckout } from "@commercengine/checkout";
import { destroyCheckout } from "@commercengine/checkout/react";
import { useEffect } from "react";
import { ensureClientSessionBootstrapped } from "@/lib/session-bootstrap";
import { storefront, storefrontConfig } from "@/lib/storefront";

export function StorefrontInitializer() {
  useEffect(() => {
    let active = true;

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
      destroyCheckout();
    };
  }, []);

  return null;
}
