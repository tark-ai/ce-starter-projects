/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: JSON-LD at build time */
/** biome-ignore-all lint/style/useComponentExportOnlyModules: Next.js page conventions */
import type { Item, Pagination } from "@commercengine/storefront";
import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { safeJsonLd } from "@/lib/safe-json-ld";
import { storefront } from "@/lib/storefront";
import { CategoryContent } from "../../category-content";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const sdk = storefront.publicStorefront();
    const { data } = await sdk.catalog.listCategories();
    return (data?.categories ?? []).map((category) => ({
      category: category.slug ?? category.id,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  const displayName = decoded.charAt(0).toUpperCase() + decoded.slice(1);

  const description = `Shop ${displayName} from ${SITE_NAME}. A tight, opinionated selection of everyday goods worth owning.`;

  return {
    title: displayName,
    description,
    openGraph: {
      title: `${displayName} | ${SITE_NAME}`,
      description,
      type: "website",
      url: `${SITE_URL}/category/${category}`,
    },
    twitter: {
      title: `${displayName} | ${SITE_NAME}`,
      description,
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;

  let skus: Item[] = [];
  let pagination: Pagination | undefined;
  let displayName = decodeURIComponent(category);
  displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
  let categoryId: string | undefined;
  let categoryName: string | undefined;

  try {
    const sdk = storefront.publicStorefront();

    const { data: categoriesData } = await sdk.catalog.listCategories();
    const categories = categoriesData?.categories ?? [];
    const matched = categories.find(
      (c) =>
        c.slug === category ||
        c.name.toLowerCase().replace(/\s+/g, "-") === category ||
        c.id === category
    );

    // Resolve the category identity from listCategories first, before touching
    // the catalog. A later SKU-fetch failure must not discard it, or the hero
    // and JSON-LD fall back to the raw slug and CategoryContent needlessly
    // re-resolves the category on the client.
    if (matched) {
      categoryId = matched.id;
      categoryName = matched.name;
      if (matched.name) displayName = matched.name;
    }

    // Only query catalog once the category is resolved; otherwise the request
    // would silently return the whole catalog instead of this category.
    if (matched?.id) {
      try {
        const { data: skusData } = await sdk.catalog.listSkus({
          page: 1,
          limit: 20,
          category_id: [matched.id],
        });

        skus = skusData?.skus ?? [];
        pagination = skusData?.pagination;
      } catch {
        // A SKU outage only empties the product/facet data; the resolved
        // category identity above is preserved.
        skus = [];
      }
    }
  } catch {
    skus = [];
  }

  const categoryUrl = `${SITE_URL}/category/${category}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: displayName,
      description: `Shop ${displayName} from ${SITE_NAME}. A tight, opinionated selection of everyday goods worth owning.`,
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
          dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
        />
      ))}
      <CategoryContent
        categorySlug={category}
        categoryId={categoryId}
        categoryName={categoryName}
        initialSkus={skus}
        initialPagination={pagination}
      />
    </>
  );
}
