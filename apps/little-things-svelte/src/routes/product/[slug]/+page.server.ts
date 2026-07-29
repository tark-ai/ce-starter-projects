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
      const { data, error } = await sdk.catalog.listProducts({ page, limit: 100 });
      if (error) {
        // Don't silently ship a static site with missing product pages — leave
        // a visible build-log signal (but keep the build green: no throw).
        // biome-ignore lint/suspicious/noConsole: surface catalog enumeration failures during build
        console.warn("[little-things] product slug enumeration failed:", error);
        break;
      }
      for (const product of data?.products ?? []) {
        slugs.push({ slug: product.slug || product.id });
      }
      const nextPage = data?.pagination?.next_page;
      if (!nextPage || nextPage === page) break;
      page = nextPage;
    }
  } catch (err) {
    // Build stays green without live catalog access, but surface the failure so
    // a catalog outage during the build is visible in the log.
    // biome-ignore lint/suspicious/noConsole: surface catalog enumeration failures during build
    console.warn("[little-things] product slug enumeration errored:", err);
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

    // A non-404 in-band SDK error is a transient/API failure, not a genuine
    // miss — take the resilient 200 fallback instead of letting it become a 404
    // below. A 404 status falls through so it surfaces as a real 404.
    if (productResult.error && productResult.response?.status !== 404) {
      // biome-ignore lint/suspicious/noConsole: surface catalog fetch failures during build/prerender
      console.warn("[little-things] product detail request failed:", productResult.error);
      return { product: null as Product | null, similarItems: [] as Item[] };
    }

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
