/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: JSON-LD at build time */
/** biome-ignore-all lint/style/useComponentExportOnlyModules: Next.js page conventions */
import type { Metadata } from "next";
import { storefront } from "@/lib/storefront";
import { CategoryContent } from "./category-content";

const SITE_URL = "https://linea-next.demo.commercengine.com";
const SITE_NAME = "Linea";

export const revalidate = 3600;

export async function generateStaticParams() {
  const sdk = storefront.publicStorefront();
  const { data } = await sdk.catalog.listCategories();
  return (data?.categories ?? []).map((category) => ({
    category: category.slug ?? category.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  const displayName = decoded.charAt(0).toUpperCase() + decoded.slice(1);

  return {
    title: displayName,
    description: `Shop ${displayName} from ${SITE_NAME}. Discover our curated collection of minimalist jewelry crafted for the modern individual.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const sdk = storefront.publicStorefront();

  const { data: categoriesData } = await sdk.catalog.listCategories();
  const categories = categoriesData?.categories ?? [];
  const matched = categories.find((c) => c.slug === category);

  const { data: skusData } = await sdk.catalog.listSkus({
    page: 1,
    limit: 20,
    category_id: matched?.id ? [matched.id] : undefined,
  });

  const decoded = decodeURIComponent(category);
  const displayName = matched?.name ?? decoded.charAt(0).toUpperCase() + decoded.slice(1);
  const categoryUrl = `${SITE_URL}/category/${category}`;
  const skus = skusData?.skus ?? [];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: displayName,
      description: `Shop ${displayName} from ${SITE_NAME}. Discover our curated collection of minimalist jewelry crafted for the modern individual.`,
      url: categoryUrl,
      ...(skus.length > 0
        ? {
            mainEntity: {
              "@type": "ItemList",
              itemListElement: skus.slice(0, 20).map((item, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `${SITE_URL}/product/${item.product_slug}`,
                name: item.product_name,
              })),
            },
          }
        : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: displayName },
      ],
    },
  ];

  return (
    <>
      {jsonLd.map((schema) => (
        <script
          key={schema["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <CategoryContent initialSkus={skus} initialPagination={skusData?.pagination} />
    </>
  );
}
