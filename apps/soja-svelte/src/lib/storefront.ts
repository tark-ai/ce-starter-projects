import { Environment } from "@commercengine/storefront";
import { createSvelteKitStorefront } from "@commercengine/storefront/sveltekit";
import { browser } from "$app/environment";
import { PUBLIC_API_KEY, PUBLIC_CE_ENV, PUBLIC_STORE_ID } from "$env/static/public";

const useStaging = PUBLIC_CE_ENV === "staging" || !PUBLIC_CE_ENV;

const sessionListeners = new Set<() => void>();
let sessionIdentity: string | null | undefined;

function identityFromToken(accessToken: string | null): string | null {
  if (!accessToken) return null;
  try {
    const payload = accessToken.split(".")[1];
    if (!payload) return accessToken;
    let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    base64 += "=".repeat((4 - (base64.length % 4)) % 4);
    const claims = JSON.parse(atob(base64)) as { ulid?: unknown };
    return typeof claims.ulid === "string" ? claims.ulid : accessToken;
  } catch {
    return accessToken;
  }
}

function updateSession(accessToken: string | null) {
  const next = identityFromToken(accessToken);
  if (sessionIdentity === next) return;
  sessionIdentity = next;
  for (const listener of sessionListeners) {
    try {
      listener();
    } catch {}
  }
}

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

    updateSession(accessToken);
  },
  onTokensCleared: () => {
    if (!browser) return;
    updateSession(null);
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
