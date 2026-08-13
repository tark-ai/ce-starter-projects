import { Environment } from "@commercengine/storefront";
import { createSvelteKitStorefront } from "@commercengine/storefront/sveltekit";
import { browser } from "$app/environment";
import { PUBLIC_API_KEY, PUBLIC_CE_ENV, PUBLIC_STORE_ID } from "$env/static/public";

const useStaging = PUBLIC_CE_ENV === "staging" || !PUBLIC_CE_ENV;

const sessionListeners = new Set<() => void>();
let seededUserId = false;
let lastUserId: string | null = null;

export function onSessionChange(listener: () => void): () => void {
  sessionListeners.add(listener);
  return () => {
    sessionListeners.delete(listener);
  };
}

export const storefront = createSvelteKitStorefront({
  storeId: PUBLIC_STORE_ID ?? "",
  apiKey: PUBLIC_API_KEY ?? "",
  environment: useStaging ? Environment.Staging : Environment.Production,
  tokenStorageOptions: { prefix: "soja_" },
  onTokensUpdated: (accessToken, refreshToken) => {
    // Browser-only integration: the dynamic import keeps it out of the server bundle.
    if (!browser) return;
    import("@commercengine/checkout")
      .then(({ getCheckout }) => {
        getCheckout().updateTokens(accessToken, refreshToken);
      })
      .catch((error) => {
        // biome-ignore lint/suspicious/noConsole: surface checkout import failures
        console.error("Failed to update checkout tokens:", error);
      });

    void (async () => {
      const next = await getSdk().getUserId();
      if (!seededUserId) {
        seededUserId = true;
        lastUserId = next;
        return;
      }
      if (lastUserId === next) return;
      lastUserId = next;
      for (const listener of sessionListeners) listener();
    })();
  },
});

let clientSdk: ReturnType<typeof storefront.clientStorefront> | null = null;

export function getSdk() {
  if (!clientSdk) clientSdk = storefront.clientStorefront();
  return clientSdk;
}

let initPromise: Promise<void> | null = null;

export function initStorefront() {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    await storefront.bootstrap();

    const sdk = getSdk();
    const accessToken = await sdk.getAccessToken();
    const refreshToken = await sdk.session.peekRefreshToken();

    if (!browser) return;
    const { initCheckout } = await import("@commercengine/checkout");
    initCheckout({
      storeId: PUBLIC_STORE_ID ?? "",
      apiKey: PUBLIC_API_KEY ?? "",
      environment: useStaging ? "staging" : "production",
      authMode: "provided",
      accessToken: accessToken ?? undefined,
      refreshToken: refreshToken ?? undefined,
      onTokensUpdated: ({ accessToken, refreshToken }) => {
        void sdk.setTokens(accessToken, refreshToken);
      },
    });
  })().catch((error) => {
    initPromise = null;
    throw error;
  });

  return initPromise;
}
