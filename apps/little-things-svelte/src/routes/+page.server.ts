import { serverStorefront } from "$lib/server/storefront";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  try {
    const sdk = serverStorefront.publicStorefront();
    const { data } = await sdk.catalog.listSkus({ page: 1, limit: 16 });
    return {
      products: data?.skus ?? [],
    };
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: surface catalog fetch failures during build/prerender
    console.error("Failed to load home products:", error);
    return { products: [] };
  }
};
