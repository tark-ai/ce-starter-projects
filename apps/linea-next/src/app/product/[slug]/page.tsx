/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: JSON-LD at build time */
/** biome-ignore-all lint/style/useComponentExportOnlyModules: Next.js page conventions */
import type { Metadata } from "next";
import { Suspense } from "react";
import { storefront } from "@/lib/storefront";
import { ProductContent } from "./product-content";

const SITE_URL = "https://linea.demo.commercengine.com";
const SITE_NAME = "Linea";

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

  return {
    title: product.name,
    description: product.short_description ?? `Shop ${product.name} from ${SITE_NAME}`,
    openGraph: {
      title: product.name,
      description: product.short_description ?? undefined,
      type: "website",
      ...(image ? { images: [{ url: image }] } : {}),
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
      <Suspense>
        <ProductContent serverProduct={product} serverSimilarItems={similarItems} />
      </Suspense>
    </>
  );
}
