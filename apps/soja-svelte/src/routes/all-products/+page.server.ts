import { serverStorefront } from "$lib/server/storefront";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  // Settled, not all: a categories outage must not discard a successful product read.
  const sdk = serverStorefront.publicStorefront();
  const [skuResult, categoryResult] = await Promise.allSettled([
    sdk.catalog.searchProducts({ query: "", page: 1, limit: 12 }),
    sdk.catalog.listCategories(),
  ]);

  if (skuResult.status === "rejected") {
    // biome-ignore lint/suspicious/noConsole: surface catalog failures during prerender
    console.error("Failed to load all products:", skuResult.reason);
  }
  if (categoryResult.status === "rejected") {
    // biome-ignore lint/suspicious/noConsole: surface catalog failures during prerender
    console.error("Failed to load categories:", categoryResult.reason);
  }

  return {
    skus: skuResult.status === "fulfilled" ? (skuResult.value.data?.skus ?? []) : [],
    pagination: skuResult.status === "fulfilled" ? skuResult.value.data?.pagination : undefined,
    categories:
      categoryResult.status === "fulfilled" ? (categoryResult.value.data?.categories ?? []) : [],
  };
};
