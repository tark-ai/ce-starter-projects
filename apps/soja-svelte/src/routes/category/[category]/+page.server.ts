import type { Category } from "@commercengine/storefront";
import { buildFilter } from "$lib/build-filter";
import { serverStorefront } from "$lib/server/storefront";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const sdk = serverStorefront.publicStorefront();

  // Resolve the category identity first so it survives a later SKU failure.
  let categoryName: string | undefined;
  let categoryDescription: string | undefined;
  let categories: Category[] = [];

  try {
    const { data } = await sdk.catalog.listCategories();
    categories = data?.categories ?? [];
    const matched = categories.find(
      (entry) =>
        entry.slug === params.category ||
        entry.name.toLowerCase().replace(/\s+/g, "-") === params.category ||
        entry.id === params.category
    );
    categoryName = matched?.name;
    categoryDescription = matched?.description ?? undefined;
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: surface catalog failures during prerender
    console.error("Failed to resolve category:", error);
  }

  const fallbackName =
    params.category.charAt(0).toUpperCase() + params.category.slice(1).replace(/-/g, " ");

  // An unfiltered search would return the whole catalog under this heading.
  if (!categoryName) {
    return {
      categorySlug: params.category,
      categoryName: fallbackName,
      categoryDescription,
      categories,
      skus: [],
      pagination: undefined,
    };
  }

  try {
    const filter = buildFilter({}, categoryName);
    const { data } = await sdk.catalog.searchProducts({
      query: "",
      page: 1,
      limit: 12,
      ...(filter.length > 0 ? { filter } : {}),
    });

    return {
      categorySlug: params.category,
      categoryName,
      categoryDescription,
      categories,
      skus: data?.skus ?? [],
      pagination: data?.pagination,
    };
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: surface catalog failures during prerender
    console.error("Failed to load category products:", error);
    return {
      categorySlug: params.category,
      categoryName,
      categoryDescription,
      categories,
      skus: [],
      pagination: undefined,
    };
  }
};
