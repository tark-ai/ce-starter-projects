import { initCheckout } from "@commercengine/checkout";
import { destroyCheckout } from "@commercengine/checkout/react";
import { useEffect } from "react";
import { ensureServerAuth } from "@/lib/server-fns/auth";
import { sdk, tokenStorage } from "@/lib/storefront";

/**
 * Client-side initialization component. Placed in __root.tsx.
 *
 * 1. Ensures anonymous auth tokens exist via a server function
 * 2. Initializes hosted checkout with the current tokens
 * 3. Sets up two-way token sync between SDK and checkout
 */
export function StorefrontInitializer() {
  useEffect(() => {
    const init = async () => {
      await ensureServerAuth();

      const accessToken = await tokenStorage.getAccessToken();
      const refreshToken = await tokenStorage.getRefreshToken();

      initCheckout({
        storeId: import.meta.env.VITE_STORE_ID,
        apiKey: import.meta.env.VITE_API_KEY,
        environment:
          import.meta.env.VITE_CE_ENV === "staging" || !import.meta.env.VITE_CE_ENV
            ? "staging"
            : "production",
        authMode: "provided",
        accessToken: accessToken ?? undefined,
        refreshToken: refreshToken ?? undefined,
        onTokensUpdated: ({ accessToken, refreshToken }) => {
          // checkout -> SDK: keep SDK in sync when checkout tokens change
          sdk.setTokens(accessToken, refreshToken);
        },
      });
    };

    init();

    return () => {
      destroyCheckout();
    };
  }, []);

  return null;
}
