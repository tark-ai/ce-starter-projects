import { serverStorefront } from "$lib/server/storefront";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const sdk = serverStorefront.publicStorefront();

  // Resolve the canonical category name up front so it survives even when the
  // subsequent listSkus call throws — otherwise title/meta/OG/schema would
  // degrade to the raw slug on the error path.
  let displayName = params.category
    ? params.category.charAt(0).toUpperCase() + params.category.slice(1)
    : "All products";
  let categorySlug: string | null = null;
  let categoryId: string | undefined;

  try {
    const { data: catData } = await sdk.catalog.listCategories();
    const categories = catData?.categories ?? [];
    const resolved = categories.find((c) => c.slug === params.category || c.id === params.category);
    if (resolved?.name) displayName = resolved.name;
    categorySlug = resolved?.slug ?? null;
    categoryId = resolved?.id;
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: surface catalog fetch failures during build/prerender
    console.error("Failed to load categories:", error);
  }

  try {
    const { data: skusData } = await sdk.catalog.listSkus({
      page: 1,
      limit: 20,
      category_id: categoryId ? [categoryId] : undefined,
    });

    return {
      category: params.category,
      displayName,
      categorySlug,
      skus: skusData?.skus ?? [],
      pagination: skusData?.pagination,
    };
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: surface catalog fetch failures during build/prerender
    console.error("Failed to load category skus:", error);
    return {
      category: params.category,
      displayName,
      categorySlug,
      skus: [],
      pagination: undefined,
    };
  }
};
