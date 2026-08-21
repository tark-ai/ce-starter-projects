import { serializeJsonLd } from "@commercengine/seo";
import { createSvelteKitProductHead } from "@commercengine/seo/sveltekit";
import type { ProductDetail } from "@commercengine/storefront";
import { error } from "@sveltejs/kit";
import { seo } from "$lib/commerce-seo";
import { serverStorefront } from "$lib/server/storefront";
import type { PageServerLoad } from "./$types";

/**
 * `productHead` emits the product schema only, so the breadcrumb is the page's job. URLs come
 * from the route resolvers rather than string concatenation, so a custom `productBase` /
 * `categoryBase` stays correct here.
 */
async function productBreadcrumb(product: ProductDetail) {
  const category = product.categories?.[0];
  const home = seo.config.site.url;
  const [productUrl, categoryUrl] = await Promise.all([
    seo.productUrl(product),
    category ? seo.categoryUrl(category) : Promise.resolve(null),
  ]);

  return serializeJsonLd(
    seo.breadcrumbJsonLd([
      { name: "Home", url: home },
      ...(category && categoryUrl ? [{ name: category.name, url: categoryUrl }] : []),
      { name: product.name, url: productUrl ?? home },
    ])
  );
}

export const load: PageServerLoad = async ({ params }) => {
  const sdk = serverStorefront.publicStorefront();

  const [productResult, similarResult] = await Promise.all([
    sdk.catalog.getProductDetail({ product_id: params.slug }),
    sdk.catalog.listSimilarProducts({ product_id: [params.slug] }).catch(() => null),
  ]);

  if (productResult.error || !productResult.data?.product) {
    throw error(404, "Product not found");
  }

  const product = productResult.data.product;
  const [seoHead, breadcrumb] = await Promise.all([
    createSvelteKitProductHead(seo, product),
    productBreadcrumb(product),
  ]);

  return {
    product,
    seoHead,
    breadcrumb,
    similarItems: similarResult?.data?.products ?? [],
  };
};
