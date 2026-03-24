import { serverStorefront } from "$lib/server/storefront";
import type { LayoutServerLoad } from "./$types";

export const prerender = true;

export const load: LayoutServerLoad = async () => {
  const sdk = serverStorefront.publicStorefront();
  const { data } = await sdk.catalog.listCategories();
  return {
    categories: data?.categories ?? [],
  };
};
