import type { Item, Product } from "@commercengine/storefront";
import { serverStorefront } from "$lib/server/storefront";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  try {
    const sdk = serverStorefront.publicStorefront();

    const [productResult, similarResult] = await Promise.all([
      sdk.catalog.getProductDetail({ product_id: params.slug }),
      sdk.catalog.listSimilarProducts({ product_id: [params.slug] }).catch(() => null),
    ]);

    const product = productResult.data?.product ?? null;
    return {
      product: product as Product | null,
      similarItems: (similarResult?.data?.products ?? []) as Item[],
    };
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: surface catalog fetch failures during build/prerender
    console.error("Failed to load product:", error);
    return { product: null as Product | null, similarItems: [] as Item[] };
  }
};
