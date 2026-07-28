import type { Item, Product } from "@commercengine/storefront";
import { error } from "@sveltejs/kit";
import { serverStorefront } from "$lib/server/storefront";
import type { EntryGenerator, PageServerLoad } from "./$types";

// Enumerate every product slug so the static build prerenders all product
// pages — not only the ones discovered by crawling the initially prerendered
// pages. Without this, products reachable solely via client-side pagination /
// search would 404 (the static adapter can't run this load on demand).
export const entries: EntryGenerator = async () => {
  const slugs: Array<{ slug: string }> = [];
  try {
    const sdk = serverStorefront.publicStorefront();
    let page = 1;
    for (let guard = 0; guard < 200; guard++) {
      const { data } = await sdk.catalog.listProducts({ page, limit: 100 });
      for (const product of data?.products ?? []) {
        slugs.push({ slug: product.slug || product.id });
      }
      const nextPage = data?.pagination?.next_page;
      if (!nextPage || nextPage === page) break;
      page = nextPage;
    }
  } catch {
    // Build stays green without live catalog access.
  }
  return slugs;
};

export const load: PageServerLoad = async ({ params }) => {
  let product: Product | null = null;
  let similarItems: Item[] = [];

  try {
    const sdk = serverStorefront.publicStorefront();

    const [productResult, similarResult] = await Promise.all([
      sdk.catalog.getProductDetail({ product_id: params.slug }),
      sdk.catalog.listSimilarProducts({ product_id: [params.slug] }).catch(() => null),
    ]);

    product = (productResult.data?.product ?? null) as Product | null;
    similarItems = (similarResult?.data?.products ?? []) as Item[];
  } catch (err) {
    // A fetch/network failure (e.g. transient error during prerender, or no
    // live creds at build) must NOT surface as a 404 — stay resilient and let
    // the page render its fallback with a 200.
    // biome-ignore lint/suspicious/noConsole: surface catalog fetch failures during build/prerender
    console.error("Failed to load product:", err);
    return { product: null as Product | null, similarItems: [] as Item[] };
  }

  // The request succeeded but there is genuinely no such product → real 404
  // instead of a soft-404 (200 page with a homepage canonical).
  if (!product) {
    throw error(404, "Product not found");
  }

  return { product, similarItems };
};
