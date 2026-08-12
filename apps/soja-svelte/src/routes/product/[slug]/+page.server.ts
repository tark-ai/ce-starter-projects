import type { Item } from "@commercengine/storefront";
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
  let product: SojaProductDetail | null = null;
  let similarItems: Item[] = [];

  try {
    const sdk = serverStorefront.publicStorefront();
    const [detail, similar] = await Promise.all([
      sdk.catalog.getProductDetail({ product_id: params.slug }),
      sdk.catalog.listSimilarProducts({ product_id: [params.slug] }).catch(() => null),
    ]);

    product = detail.data?.product ?? null;
    similarItems = similar?.data?.products ?? [];
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: surface catalog failures during prerender
    console.error(`Failed to load product "${params.slug}":`, error);
  }

  return { product, similarItems, slug: params.slug };
};
