import { serverStorefront } from "$lib/server/storefront";
import type { LayoutServerLoad } from "./$types";

export const prerender = true;

export const load: LayoutServerLoad = async () => {
  try {
    const sdk = serverStorefront.publicStorefront();
    const { data } = await sdk.catalog.listCategories();
    return {
      categories: data?.categories ?? [],
    };
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: surface catalog fetch failures during build/prerender
    console.error("Failed to load categories:", error);
    return { categories: [] };
  }
};
