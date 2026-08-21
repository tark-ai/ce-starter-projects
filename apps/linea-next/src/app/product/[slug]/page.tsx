/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: JSON-LD at build time */
/** biome-ignore-all lint/style/useComponentExportOnlyModules: Next.js page conventions */
import { createProductMetadata, productOpenGraphTags } from "@commercengine/seo/nextjs";
import type { Metadata } from "next";
import { Suspense } from "react";
import { seo } from "@/lib/seo";
import { storefront } from "@/lib/storefront";
import { ProductContent } from "./product-content";

export const revalidate = 3600;

export async function generateStaticParams() {
  const sdk = storefront.publicStorefront();
  const { data } = await sdk.catalog.listProducts({ limit: 100 });
  return (data?.products ?? []).map((product) => ({
    slug: product.slug || product.id,
  }));
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

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sdk = storefront.publicStorefront();

  const [productResult, similarResult] = await Promise.all([
    sdk.catalog.getProductDetail({ product_id: slug }),
    sdk.catalog.listSimilarProducts({ product_id: [slug] }),
  ]);

  const product = productResult.data?.product;
  const similarItems = similarResult.data?.products ?? [];

  const [productJsonLd, breadcrumbJsonLd] = product
    ? await Promise.all([
        seo.productJsonLd(product),
        Promise.resolve(
          seo.breadcrumbJsonLd([
            { name: "Home", url: seo.config.site.url },
            ...(product.categories?.[0]
              ? [
                  {
                    name: product.categories[0].name,
                    url: (await seo.categoryUrl(product.categories[0])) ?? seo.config.site.url,
                  },
                ]
              : []),
            { name: product.name, url: (await seo.productUrl(product)) ?? seo.config.site.url },
          ])
        ),
      ])
    : [null, null];

  const jsonLd = productJsonLd && breadcrumbJsonLd ? [productJsonLd, breadcrumbJsonLd] : [];

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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <ProductContent serverProduct={product} serverSimilarItems={similarItems} />
      </Suspense>
    </>
  );
}
