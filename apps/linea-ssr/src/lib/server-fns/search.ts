import type { SearchProductsBody } from "@commercengine/storefront-sdk";
import { createServerFn } from "@tanstack/react-start";
import { ensureAuth, sdk } from "@/lib/storefront";

export const searchProducts = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      query?: string;
      page?: number;
      limit?: number;
      facets?: string[];
      filter?: SearchProductsBody["filter"];
      sort?: SearchProductsBody["sort"];
    }) => d
  )
  .handler(async ({ data }) => {
    await ensureAuth();
    const body: SearchProductsBody = {
      query: data.query ?? "",
      page: data.page ?? 1,
      limit: data.limit ?? 20,
      facets: data.facets ?? ["*"],
    };
    if (data.filter) body.filter = data.filter;
    if (data.sort) body.sort = data.sort;

    const { data: result, error } = await sdk.catalog.searchProducts(body);
    if (error) throw new Error(error.message);
    return result;
  });
