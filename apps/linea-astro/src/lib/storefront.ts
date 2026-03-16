import { Environment, PublicStorefrontSDK } from "@commercengine/storefront";

const useStaging = import.meta.env.PUBLIC_CE_ENV === "staging" || !import.meta.env.PUBLIC_CE_ENV;

export const publicSdk = new PublicStorefrontSDK({
  storeId: import.meta.env.PUBLIC_STORE_ID ?? "",
  apiKey: import.meta.env.PUBLIC_API_KEY ?? "",
  environment: useStaging ? Environment.Staging : Environment.Production,
});
