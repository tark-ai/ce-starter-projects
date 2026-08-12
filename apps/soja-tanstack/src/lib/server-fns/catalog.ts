import { createServerFn } from "@tanstack/react-start";
import { storefront } from "@/lib/storefront";

export const fetchCategories = createServerFn({ method: "GET" }).handler(async () => {
  const sdk = storefront.publicStorefront();
  const { data, error } = await sdk.catalog.listCategories();
  if (error) throw new Error(error.message);
  return data?.categories ?? [];
});

export const fetchListSkus = createServerFn({ method: "GET" })
  .inputValidator(
    (d: { page?: number; limit?: number; category_id?: string[] } | undefined) => d ?? {}
  )
  .handler(async ({ data }) => {
    const sdk = storefront.publicStorefront();
    const { data: result, error } = await sdk.catalog.listSkus({
      page: data.page ?? 1,
      limit: data.limit ?? 20,
      category_id: data.category_id,
    });
    if (error) throw new Error(error.message);
    return result;
  });

export const fetchProductDetail = createServerFn({ method: "GET" })
  .inputValidator((d: string) => d)
  .handler(async ({ data }) => {
    const sdk = storefront.publicStorefront();
    const { data: result, error } = await sdk.catalog.getProductDetail({ product_id: data });
    if (error) throw new Error(error.message);
    return result?.product ?? null;
  });

export const fetchSimilarProducts = createServerFn({ method: "GET" })
  .inputValidator((d: string) => d)
  .handler(async ({ data }) => {
    const sdk = storefront.publicStorefront();
    const { data: result, error } = await sdk.catalog.listSimilarProducts({ product_id: [data] });
    if (error) throw new Error(error.message);
    return result?.products ?? [];
  });
