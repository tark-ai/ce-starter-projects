import { serverStorefront } from "$lib/server/storefront";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  // One request covers both product rows plus the testimonial's overlapping card.
  try {
    const sdk = serverStorefront.publicStorefront();
    const { data } = await sdk.catalog.listSkus({ page: 1, limit: 24 });
    return { skus: data?.skus ?? [] };
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: surface catalog failures during prerender
    console.error("Failed to load home products:", error);
    return { skus: [] };
  }
};
