import { Environment } from "@commercengine/storefront";
import { createAstroServerStorefront } from "@commercengine/storefront/astro/server";

const useStaging = import.meta.env.PUBLIC_CE_ENV === "staging" || !import.meta.env.PUBLIC_CE_ENV;

const serverStorefront = createAstroServerStorefront({
  storeId: import.meta.env.PUBLIC_STORE_ID ?? "",
  apiKey: import.meta.env.PUBLIC_API_KEY ?? "",
  environment: useStaging ? Environment.Staging : Environment.Production,
  tokenStorageOptions: { prefix: "linea_" },
});

export const publicSdk = serverStorefront.publicStorefront();
