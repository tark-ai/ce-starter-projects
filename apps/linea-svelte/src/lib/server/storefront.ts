import { Environment } from "@commercengine/storefront";
import { createSvelteKitServerStorefront } from "@commercengine/storefront/sveltekit/server";
import { PUBLIC_API_KEY, PUBLIC_CE_ENV, PUBLIC_STORE_ID } from "$env/static/public";

const useStaging = PUBLIC_CE_ENV === "staging" || !PUBLIC_CE_ENV;

export const serverStorefront = createSvelteKitServerStorefront({
  storeId: PUBLIC_STORE_ID ?? "",
  apiKey: PUBLIC_API_KEY ?? "",
  environment: useStaging ? Environment.Staging : Environment.Production,
  tokenStorageOptions: { prefix: "linea_" },
});
