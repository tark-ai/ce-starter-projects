import { serverStorefront } from "$lib/server/storefront";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  try {
    const sdk = serverStorefront.publicStorefront();
    const [skuResult, categoryResult] = await Promise.all([
      sdk.catalog.searchProducts({ query: "", page: 1, limit: 12 }),
      sdk.catalog.listCategories(),
    ]);

    return {
      skus: skuResult.data?.skus ?? [],
      pagination: skuResult.data?.pagination,
      categories: categoryResult.data?.categories ?? [],
    };
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: surface catalog failures during prerender
    console.error("Failed to load all products:", error);
    return { skus: [], pagination: undefined, categories: [] };
  }
};
