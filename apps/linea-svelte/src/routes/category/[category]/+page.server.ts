import { serverStorefront } from "$lib/server/storefront";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const sdk = serverStorefront.publicStorefront();

  // Resolve the category — "shop" is a catch-all that shows everything
  const { data: catData } = await sdk.catalog.listCategories();
  const categories = catData?.categories ?? [];
  const resolved = categories.find((c) => c.slug === params.category || c.id === params.category);

  const categoryId = resolved?.id;
  const displayName =
    resolved?.name ??
    (params.category
      ? params.category.charAt(0).toUpperCase() + params.category.slice(1)
      : "All Products");

  // Fetch initial SKUs — filtered by category_id if resolved, otherwise all
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
};
