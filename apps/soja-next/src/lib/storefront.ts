import { createSessionChangeNotifier } from "@ce/soja-shared/lib/session-change";
import { Environment } from "@commercengine/storefront";
import { createNextjsStorefront } from "@commercengine/storefront/nextjs";

const useStaging = process.env.NEXT_PUBLIC_CE_ENV === "staging" || !process.env.NEXT_PUBLIC_CE_ENV;

const sessionChange = createSessionChangeNotifier();
export const onSessionChange = sessionChange.subscribe;

export const storefront = createNextjsStorefront({
  storeId: process.env.NEXT_PUBLIC_STORE_ID ?? "",
  apiKey: process.env.NEXT_PUBLIC_API_KEY ?? "",
  environment: useStaging ? Environment.Staging : Environment.Production,
  tokenStorageOptions: { prefix: "soja_" },
  onTokensUpdated: (accessToken, refreshToken) => {
    if (typeof window !== "undefined") {
      void import("@commercengine/checkout").then(({ getCheckout }) => {
        getCheckout().updateTokens(accessToken, refreshToken);
      });
      sessionChange.update(accessToken);
    }
  },
  onTokensCleared: () => {
    if (typeof window !== "undefined") sessionChange.update(null);
  },
});
