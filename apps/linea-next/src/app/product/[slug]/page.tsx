/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: JSON-LD at build time */
/** biome-ignore-all lint/style/useComponentExportOnlyModules: Next.js page conventions */
import type { Metadata } from "next";
import { Suspense } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
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
  const product = data?.product;

  if (!product) return { title: "Product Not Found" };

  const image = product.images?.[0]?.url_zoom ?? product.images?.[0]?.url_standard;
  const fallbackDescription = `Shop ${product.name} from ${SITE_NAME}. Discover timeless elegance with our curated collection of fine jewelry.`;
  const description = product.short_description ?? fallbackDescription;

  return {
    title: product.name,
    description,
    openGraph: {
      title: `${product.name} | ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/product/${product.slug}`,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    other: {
      "og:type": "product",
    },
    twitter: {
      title: `${product.name} | ${SITE_NAME}`,
      description,
    },
  };
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

  const jsonLd = product
    ? [
        {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.short_description ?? `Shop ${product.name} from ${SITE_NAME}`,
          image: product.images?.[0]?.url_zoom ?? product.images?.[0]?.url_standard,
          sku: product.sku ?? product.slug,
          url: `${SITE_URL}/product/${product.slug}`,
          brand: { "@type": "Brand", name: SITE_NAME },
          offers: {
            "@type": "Offer",
            url: `${SITE_URL}/product/${product.slug}`,
            priceCurrency: product.pricing.currency,
            price: product.pricing.selling_price,
            availability:
              product.stock_available || product.backorder
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
          },
          ...(product.reviews_count > 0
            ? {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: (product.reviews_rating_sum / product.reviews_count).toFixed(1),
                  reviewCount: product.reviews_count,
                },
              }
            : {}),
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            ...(product.categories?.[0]
              ? [
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: product.categories[0].name,
                    item: `${SITE_URL}/category/${product.categories[0].slug}`,
                  },
                ]
              : []),
            {
              "@type": "ListItem",
              position: product.categories?.[0] ? 3 : 2,
              name: product.name,
            },
          ],
        },
      ]
    : [];

  return (
    <>
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
