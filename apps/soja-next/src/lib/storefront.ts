import { Environment } from "@commercengine/storefront";
import { createNextjsStorefront } from "@commercengine/storefront/nextjs";

const useStaging = process.env.NEXT_PUBLIC_CE_ENV === "staging" || !process.env.NEXT_PUBLIC_CE_ENV;

const sessionListeners = new Set<() => void>();

function notifySessionChange() {
  if (typeof window === "undefined") return;
  for (const listener of sessionListeners) listener();
}

export function onSessionChange(listener: () => void): () => void {
  sessionListeners.add(listener);
  return () => {
    sessionListeners.delete(listener);
  };
}

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
      notifySessionChange();
    }
  },
  onTokensCleared: notifySessionChange,
});
