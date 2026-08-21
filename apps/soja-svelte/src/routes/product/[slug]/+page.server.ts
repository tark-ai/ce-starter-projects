import { createSvelteKitProductHead } from "@commercengine/seo/sveltekit";
import { error } from "@sveltejs/kit";
import { seo } from "$lib/commerce-seo";
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

  const similarItems = similar.status === "fulfilled" ? (similar.value.data?.products ?? []) : [];

  // This runs during the static build, so there is no request to retry: a thrown
  // status would abort the whole deploy over one catalog hiccup. Only a confirmed
  // absence becomes a 404; a transport or server failure keeps a 200 and lets the
  // page render its fallback.
  if (detail.status === "rejected") {
    // biome-ignore lint/suspicious/noConsole: surface catalog failures during prerender
    console.error("[soja] product detail request failed:", detail.reason);
    return { product: null, similarItems, slug: params.slug };
  }

  const { data, error: detailError, response } = detail.value;
  if (detailError && response.status !== 404) {
    // biome-ignore lint/suspicious/noConsole: surface catalog failures during prerender
    console.warn("[soja] product detail request failed:", detailError);
    return { product: null, similarItems, slug: params.slug };
  }

  const product: SojaProductDetail | null = data?.product ?? null;
  // The request succeeded and there is genuinely no such product.
  if (!product) {
    error(404, "Product not found");
  }

  return {
    product,
    similarItems,
    slug: params.slug,
    seoHead: await createSvelteKitProductHead(seo, product),
  };
};
