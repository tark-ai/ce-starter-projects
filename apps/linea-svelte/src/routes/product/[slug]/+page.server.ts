import { error } from "@sveltejs/kit";
import { serverStorefront } from "$lib/server/storefront";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const sdk = serverStorefront.publicStorefront();

  const [productResult, similarResult] = await Promise.all([
    sdk.catalog.getProductDetail({ product_id: params.slug }),
    sdk.catalog.listSimilarProducts({ product_id: [params.slug] }).catch(() => null),
  ]);

  if (productResult.error || !productResult.data?.product) {
    throw error(404, "Product not found");
  }

  return {
    product: productResult.data.product,
    similarItems: similarResult?.data?.products ?? [],
  };
};
