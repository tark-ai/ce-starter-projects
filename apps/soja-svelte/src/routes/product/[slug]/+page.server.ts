import { error } from "@sveltejs/kit";
import type { SojaProductDetail } from "$lib/product-meta";
import { serverStorefront } from "$lib/server/storefront";
import type { EntryGenerator, PageServerLoad } from "./$types";

// Enumerate every slug so the static build prerenders all product pages, not
// only those reachable by crawling. The static adapter cannot run this on demand.
export const entries: EntryGenerator = async () => {
  const slugs: Array<{ slug: string }> = [];

  try {
    const sdk = serverStorefront.publicStorefront();
    let page = 1;
    // Safety valve against an unexpected pagination loop.
    for (let guard = 0; guard < 200; guard++) {
      const { data, error } = await sdk.catalog.listProducts({ page, limit: 100 });
      if (error) {
        // biome-ignore lint/suspicious/noConsole: surface enumeration failures during build
        console.warn("[soja] product slug enumeration failed:", error);
        break;
      }
      for (const product of data?.products ?? []) {
        slugs.push({ slug: product.slug || product.id });
      }
      const nextPage = data?.pagination?.next_page;
      if (!nextPage || nextPage === page) break;
      page = nextPage;
    }
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: surface enumeration failures during build
    console.warn("[soja] product slug enumeration errored:", error);
  }

  return slugs;
};

export const load: PageServerLoad = async ({ params }) => {
  const sdk = serverStorefront.publicStorefront();
  const [detail, similar] = await Promise.allSettled([
    sdk.catalog.getProductDetail({ product_id: params.slug }),
    sdk.catalog.listSimilarProducts({ product_id: [params.slug] }),
  ]);

  if (detail.status === "rejected") {
    // A transport failure is not a missing product; 503 keeps it retryable.
    error(503, "The catalog is unavailable right now.");
  }

  const { data, error: detailError, response } = detail.value;
  if (detailError && response.status === 404) {
    error(404, "Product not found");
  }
  if (detailError) {
    error(503, "The catalog is unavailable right now.");
  }

  const product: SojaProductDetail | null = data?.product ?? null;
  if (!product) {
    error(404, "Product not found");
  }

  return {
    product,
    similarItems: similar.status === "fulfilled" ? (similar.value.data?.products ?? []) : [],
    slug: params.slug,
  };
};
