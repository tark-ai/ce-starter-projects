"use client";

import { initCheckout } from "@commercengine/checkout";
import { destroyCheckout } from "@commercengine/checkout/react";
import { useEffect } from "react";
import { storefront } from "@/lib/storefront";

export function StorefrontBootstrap() {
  useEffect(() => {
    let active = true;

    async function init() {
      await storefront.bootstrap();

      const sdk = storefront.clientStorefront();
      const accessToken = await sdk.getAccessToken();
      const refreshToken = await sdk.session.peekRefreshToken();

      // The component unmounted while bootstrapping; the cleanup already ran
      // destroyCheckout(), so don't resurrect the checkout singleton.
      if (!active) return;

      initCheckout({
        storeId: process.env.NEXT_PUBLIC_STORE_ID ?? "",
        apiKey: process.env.NEXT_PUBLIC_API_KEY ?? "",
        environment:
          process.env.NEXT_PUBLIC_CE_ENV === "staging" || !process.env.NEXT_PUBLIC_CE_ENV
            ? "staging"
            : "production",
        authMode: "provided",
        accessToken: accessToken ?? undefined,
        refreshToken: refreshToken ?? undefined,
        onTokensUpdated: ({ accessToken, refreshToken }) => {
          void sdk.setTokens(accessToken, refreshToken);
        },
      });
    }

    init().catch((error) => {
      // biome-ignore lint/suspicious/noConsole: surface bootstrap failures for debugging
      console.error("Storefront bootstrap failed", error);
    });

    return () => {
      active = false;
      destroyCheckout();
    };
  }, []);

  return null;
}
