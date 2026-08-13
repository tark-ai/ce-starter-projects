import { Environment } from "@commercengine/storefront";
import { createTanStackStartStorefront } from "@commercengine/storefront/tanstack-start";

// workerd sends no User-Agent and the CE API requires one, so patch global fetch
// on the server to inject it.
if (typeof window === "undefined") {
  const originalFetch = globalThis.fetch;
  const USER_AGENT = "soja-tanstack/1.0";

  globalThis.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    // init.headers replaces a Request's own headers, so the effective set has to
    // be derived from whichever the call actually sends.
    const headers = new Headers(
      init?.headers ?? (input instanceof Request ? input.headers : undefined)
    );
    if (!headers.has("User-Agent")) {
      headers.set("User-Agent", USER_AGENT);
    }

    return originalFetch(input, { ...init, headers });
  };
}

const useStaging = import.meta.env.VITE_CE_ENV === "staging" || !import.meta.env.VITE_CE_ENV;

const sessionListeners = new Set<() => void>();
let seededUserId = false;
let lastUserId: string | null = null;

export function onSessionChange(listener: () => void): () => void {
  sessionListeners.add(listener);
  return () => {
    sessionListeners.delete(listener);
  };
}

export const storefrontConfig = {
  storeId: import.meta.env.VITE_STORE_ID,
  apiKey: import.meta.env.VITE_API_KEY,
  environment: useStaging ? Environment.Staging : Environment.Production,
  tokenStorageOptions: { prefix: "soja_" },
  onTokensUpdated: (accessToken: string, refreshToken: string) => {
    if (typeof window !== "undefined") {
      void import("@commercengine/checkout").then(({ getCheckout }) => {
        getCheckout().updateTokens(accessToken, refreshToken);
      });

      void (async () => {
        const next = await storefront.clientStorefront().getUserId();
        if (!seededUserId) {
          seededUserId = true;
          lastUserId = next;
          return;
        }
        if (lastUserId === next) return;
        lastUserId = next;
        for (const listener of sessionListeners) listener();
      })();
    }
  },
};

export const storefront = createTanStackStartStorefront(storefrontConfig);
