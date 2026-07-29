import { createServerFn } from "@tanstack/react-start";
import { storefront } from "@/lib/storefront";

export const fetchProducts = createServerFn({ method: "GET" })
  .inputValidator(
    (d: { page?: number; limit?: number; category_id?: string[] } | undefined) => d ?? {}
  )
  .handler(async ({ data }) => {
    const sdk = storefront.publicStorefront();
    const { page = 1, limit = 6, category_id } = data;
    const { data: result, error } = await sdk.catalog.listProducts({
      page,
      limit,
      category_id,
    });
    if (error) throw new Error(error.message);
    return result;
  });

export const fetchProductDetail = createServerFn({ method: "GET" })
  .inputValidator((d: string) => d)
  .handler(async ({ data }) => {
    const sdk = storefront.publicStorefront();
    const { data: result, error } = await sdk.catalog.getProductDetail({
      product_id: data,
    });
    if (error) throw new Error(error.message);
    return result?.product ?? null;
  });

export const fetchCategories = createServerFn({ method: "GET" }).handler(async () => {
  const sdk = storefront.publicStorefront();
  const { data, error } = await sdk.catalog.listCategories();
  if (error) throw new Error(error.message);
  return data?.categories ?? [];
});

export const fetchListSkus = createServerFn({ method: "GET" })
  .inputValidator(
    (d: { category_id?: string[]; categoryId?: string; page?: number; limit?: number }) => d
  )
  .handler(async ({ data }) => {
    const sdk = storefront.publicStorefront();
    const categoryIds = data.category_id ?? (data.categoryId ? [data.categoryId] : undefined);

    const { data: result, error } = await sdk.catalog.listSkus({
      page: data.page ?? 1,
      limit: data.limit ?? 20,
      category_id: categoryIds,
    });
    if (error) throw new Error(error.message);
    return result;
  });

export const fetchSimilarProducts = createServerFn({ method: "GET" })
  .inputValidator((d: string) => d)
  .handler(async ({ data }) => {
    const sdk = storefront.publicStorefront();
    const { data: result, error } = await sdk.catalog.listSimilarProducts({
      product_id: [data],
    });
    if (error) throw new Error(error.message);
    return result?.products ?? [];
  });
