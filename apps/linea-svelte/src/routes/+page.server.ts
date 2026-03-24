import { serverStorefront } from "$lib/server/storefront";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const sdk = serverStorefront.publicStorefront();
  const { data } = await sdk.catalog.listSkus({ page: 1, limit: 6 });
  return {
    products: data?.skus ?? [],
  };
};
