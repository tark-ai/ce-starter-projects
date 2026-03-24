import { serverStorefront } from "$lib/server/storefront";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
  const query = url.searchParams.get("q") ?? "";
  if (!query) return { query, skus: [], pagination: undefined };

  const sdk = serverStorefront.publicStorefront();
  const { data } = await sdk.catalog.searchProducts({
    query,
    page: 1,
    limit: 20,
    facets: ["*"],
  });

  return {
    query,
    skus: data?.skus ?? [],
    pagination: data?.pagination,
  };
};
