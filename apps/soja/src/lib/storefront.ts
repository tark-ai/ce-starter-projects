import { getCheckout, initCheckout } from "@commercengine/checkout";
import { destroyCheckout as destroyCheckoutSingleton } from "@commercengine/checkout/react";
import { BrowserTokenStorage, createStorefront, Environment } from "@commercengine/storefront";

const tokenStorage = new BrowserTokenStorage("soja_");

const useStaging = import.meta.env.VITE_CE_ENV === "staging" || !import.meta.env.VITE_CE_ENV;

const storefront = createStorefront({
  storeId: import.meta.env.VITE_STORE_ID,
  environment: useStaging ? Environment.Staging : Environment.Production,
  apiKey: import.meta.env.VITE_API_KEY,
  session: {
    tokenStorage,
    onTokensUpdated: (accessToken, refreshToken) => {
      getCheckout().updateTokens(accessToken, refreshToken);
    },
  },
});

export const sdk = storefront.session();

let initPromise: Promise<void> | null = null;
// Bumped by teardown so an attempt started before it can neither resurrect the
// checkout singleton nor clear a memo it no longer owns.
let initGeneration = 0;

export function initStorefront() {
  if (initPromise) return initPromise;

  const generation = initGeneration;

  initPromise = (async () => {
    const accessToken = await sdk.ensureAccessToken();
    const refreshToken = await tokenStorage.getRefreshToken();
    if (generation !== initGeneration) return;

    initCheckout({
      storeId: import.meta.env.VITE_STORE_ID,
      apiKey: import.meta.env.VITE_API_KEY,
      environment: useStaging ? "staging" : "production",
      authMode: "provided",
      accessToken: accessToken ?? undefined,
      refreshToken: refreshToken ?? undefined,
      onTokensUpdated: ({ accessToken, refreshToken }) => {
        void sdk.setTokens(accessToken, refreshToken);
      },
    });
  })().catch((error) => {
    // Cleared so a retry starts a fresh attempt instead of replaying the failure;
    // overlapping callers meanwhile share the one in-flight init. Only while this
    // attempt still owns the memo: a teardown, or the attempt that replaced it,
    // must not have its own memo dropped by this older failure.
    if (generation === initGeneration) initPromise = null;
    throw error;
  });

  return initPromise;
}

/**
 * Readiness gate for session-bound calls. `sdk` is callable before
 * initStorefront() has established a session, so the first wishlist read can
 * race the bootstrap. A failed bootstrap is swallowed so the request still
 * proceeds on the SDK's own on-demand session path rather than being blocked.
 */
export async function whenStorefrontReady(): Promise<void> {
  try {
    await initStorefront();
  } catch {
    // Fall through to the on-demand session path.
  }
}

export function destroyCheckout() {
  // The memo describes the checkout being torn down, so it has to go with it.
  initGeneration += 1;
  initPromise = null;
  destroyCheckoutSingleton();
}
