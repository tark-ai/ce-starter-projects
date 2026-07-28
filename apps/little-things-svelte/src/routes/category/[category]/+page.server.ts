import { serverStorefront } from "$lib/server/storefront";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  try {
    const sdk = serverStorefront.publicStorefront();

    const { data: catData } = await sdk.catalog.listCategories();
    const categories = catData?.categories ?? [];
    const resolved = categories.find((c) => c.slug === params.category || c.id === params.category);

    const categoryId = resolved?.id;
    const displayName =
      resolved?.name ??
      (params.category
        ? params.category.charAt(0).toUpperCase() + params.category.slice(1)
        : "All products");

    const { data: skusData } = await sdk.catalog.listSkus({
      page: 1,
      limit: 20,
      category_id: categoryId ? [categoryId] : undefined,
    });

    return {
      category: params.category,
      displayName,
      categorySlug: resolved?.slug ?? null,
      skus: skusData?.skus ?? [],
      pagination: skusData?.pagination,
    };
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: surface catalog fetch failures during build/prerender
    console.error("Failed to load category:", error);
    return {
      category: params.category,
      displayName: params.category
        ? params.category.charAt(0).toUpperCase() + params.category.slice(1)
        : "All products",
      categorySlug: null,
      skus: [],
      pagination: undefined,
    };
  }
};
