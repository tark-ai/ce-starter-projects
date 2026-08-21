import { type CommerceSeoHead, createCommerceSeo, serializeJsonLd } from "@commercengine/seo";
import type { Category, ProductDetail } from "@commercengine/storefront";
import { useEffect, useState } from "react";
import { commerceSeo } from "./commerce-seo.config";
import { storefront } from "./storefront";

export { routes, site } from "./commerce-seo.config";

/**
 * One SEO instance for the app. A single-page app has no server render, so head data is
 * resolved in an effect and applied once it arrives.
 */
export const seo = createCommerceSeo({ ...commerceSeo, storefront });

/**
 * Head data for a product or category, or `null` until it resolves.
 *
 * Building it needs route resolution, which is async, so it cannot be computed inline during
 * render. Pass the result to `<Seo head={...} />`.
 */
/**
 * `productHead` emits the product schema only, so the breadcrumb is the page's job. Appending it
 * to `scripts` means every consumer of the head renders it without extra wiring. URLs come from
 * the route resolvers, so a custom `productBase` / `categoryBase` stays correct.
 */
async function withBreadcrumb(
  head: CommerceSeoHead,
  product: ProductDetail
): Promise<CommerceSeoHead> {
  const category = product.categories?.[0];
  const home = seo.config.site.url;
  const [productUrl, categoryUrl] = await Promise.all([
    seo.productUrl(product),
    category ? seo.categoryUrl(category) : Promise.resolve(null),
  ]);

  const breadcrumb = seo.breadcrumbJsonLd([
    { name: "Home", url: home },
    ...(category && categoryUrl ? [{ name: category.name, url: categoryUrl }] : []),
    { name: product.name, url: productUrl ?? home },
  ]);

  return {
    ...head,
    scripts: [
      ...head.scripts,
      { type: "application/ld+json", content: serializeJsonLd(breadcrumb) },
    ],
  };
}

export function useCommerceSeoHead(
  entity: ProductDetail | Category | null | undefined,
  kind: "product" | "category"
): CommerceSeoHead | null {
  const [head, setHead] = useState<CommerceSeoHead | null>(null);

  useEffect(() => {
    if (!entity) {
      setHead(null);
      return;
    }
    let active = true;
    const build =
      kind === "product"
        ? seo
            .productHead(entity as ProductDetail)
            .then((value) => withBreadcrumb(value, entity as ProductDetail))
        : seo.categoryHead(entity as Category);
    void build
      .then((value) => {
        if (active) setHead(value);
      })
      .catch(() => {
        if (active) setHead(null);
      });
    return () => {
      active = false;
    };
  }, [entity, kind]);

  return head;
}
