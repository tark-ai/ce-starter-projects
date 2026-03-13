import { Environment } from "@commercengine/storefront";
import { createTanStackStartStorefront } from "@commercengine/storefront/tanstack-start";

// Cloudflare Workers/workerd doesn't send a User-Agent by default.
// The CE API requires one, so patch global fetch on the server to inject it.
if (typeof window === "undefined") {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    if (input instanceof Request) {
      if (!input.headers.has("User-Agent")) {
        input.headers.set("User-Agent", "linea-ssr/1.0");
      }
      return originalFetch(input, init);
    }

    const headers = new Headers(init?.headers);
    if (!headers.has("User-Agent")) {
      headers.set("User-Agent", "linea-ssr/1.0");
    }

    return originalFetch(input, { ...init, headers });
  };
}

const useStaging = import.meta.env.VITE_CE_ENV === "staging" || !import.meta.env.VITE_CE_ENV;
const environment = useStaging ? Environment.Staging : Environment.Production;

export const storefront = createTanStackStartStorefront({
  storeId: import.meta.env.VITE_STORE_ID,
  apiKey: import.meta.env.VITE_API_KEY,
  environment,
  tokenStorageOptions: {
    prefix: "linea_",
  },
  onTokensUpdated: (accessToken, refreshToken) => {
    if (typeof window !== "undefined") {
      void import("@commercengine/checkout").then(({ getCheckout }) => {
        getCheckout().updateTokens(accessToken, refreshToken);
      });
    }
  },
});
