import { storefront } from "@/lib/storefront";

let sessionBootstrapPromise: Promise<void> | null = null;

/** Session-bound server functions await this so they don't race the initial cookie. */
export function ensureClientSessionBootstrapped() {
  if (typeof window === "undefined") return Promise.resolve();

  if (!sessionBootstrapPromise) {
    sessionBootstrapPromise = storefront.bootstrap().catch((error) => {
      sessionBootstrapPromise = null;
      throw error;
    });
  }

  return sessionBootstrapPromise;
}
