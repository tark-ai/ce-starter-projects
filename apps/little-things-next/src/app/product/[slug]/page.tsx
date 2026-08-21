/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: JSON-LD at build time */
/** biome-ignore-all lint/style/useComponentExportOnlyModules: Next.js page conventions */

import { createProductMetadata, productOpenGraphTags } from "@commercengine/seo/nextjs";
import type { ProductDetail } from "@commercengine/storefront";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { safeJsonLd } from "@/lib/safe-json-ld";
import { seo } from "@/lib/seo";
import { storefront } from "@/lib/storefront";
import { ProductContent } from "./product-content";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const sdk = storefront.publicStorefront();
    const { data } = await sdk.catalog.listProducts({ limit: 100 });
    return (data?.products ?? []).map((product) => ({
      slug: product.slug || product.id,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sdk = storefront.publicStorefront();
  const { data } = await sdk.catalog.getProductDetail({ product_id: slug });

  if (!data?.product) return { title: "Product Not Found" };
  return createProductMetadata(seo, data.product);
}

/**
 * `productHead` / `productJsonLd` emit the product schema only, so the breadcrumb is the
 * page's job. URLs come from the route resolvers rather than string concatenation, so a
 * custom `productBase` / `categoryBase` stays correct here.
 */
async function productBreadcrumb(product: ProductDetail) {
  const category = product.categories?.[0];
  const home = seo.config.site.url;
  const [productUrl, categoryUrl] = await Promise.all([
    seo.productUrl(product),
    category ? seo.categoryUrl(category) : Promise.resolve(null),
  ]);

  return seo.breadcrumbJsonLd([
    { name: "Home", url: home },
    ...(category && categoryUrl ? [{ name: category.name, url: categoryUrl }] : []),
    { name: product.name, url: productUrl ?? home },
  ]);
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let product: ProductDetail | undefined;
  let confirmedNotFound = false;
  try {
    const sdk = storefront.publicStorefront();
    const { data, error, response } = await sdk.catalog.getProductDetail({ product_id: slug });

    if (error) {
      // Only a 404 means the product is genuinely absent; any other status is a
      // transient API failure that ProductContent can retry on the client.
      confirmedNotFound = response.status === 404;
    } else {
      product = data?.product;
      // The request succeeded but returned no product: a real not-found.
      confirmedNotFound = !product;
    }
  } catch {
    // Transport/server failure: fall through to the client-retry fallback.
    product = undefined;
  }

  // Serve the global 404 only for a confirmed not-found. A transient failure
  // renders the fallback so ProductContent's client query can retry.
  if (confirmedNotFound) {
    notFound();
  }

  const jsonLd = product
    ? await Promise.all([seo.productJsonLd(product), productBreadcrumb(product)])
    : [];

  return (
    <>
      {product &&
        productOpenGraphTags(product).map((tag) => (
          <meta key={tag.property} property={tag.property} content={tag.content} />
        ))}
      {jsonLd.map((schema) => (
        <script
          key={schema["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
        />
      ))}
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <ProductContent serverProduct={product} />
      </Suspense>
    </>
  );
}
