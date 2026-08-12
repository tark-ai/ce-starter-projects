/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: JSON-LD at build time */
/** biome-ignore-all lint/style/useComponentExportOnlyModules: Next.js page conventions */
import type { Category, Item, Pagination } from "@commercengine/storefront";
import type { Metadata } from "next";
import { buildFilter } from "@/lib/build-filter";
import { OG_IMAGES, SITE_NAME, SITE_URL, TWITTER_IMAGE } from "@/lib/constants";
import { safeJsonLd } from "@/lib/safe-json-ld";
import { PLP_COPY } from "@/lib/site-content";
import { storefront } from "@/lib/storefront";
import { CategoryContent } from "../../category-content";

export const revalidate = 3600;

function matchCategory(categories: Category[], slug: string): Category | undefined {
  return categories.find(
    (entry) =>
      entry.slug === slug ||
      entry.name.toLowerCase().replace(/\s+/g, "-") === slug ||
      entry.id === slug
  );
}

function titleCase(slug: string): string {
  const decoded = decodeURIComponent(slug).replace(/-/g, " ");
  return decoded.charAt(0).toUpperCase() + decoded.slice(1);
}

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

  let displayName = titleCase(category);
  let description: string = PLP_COPY.subtitle;

  try {
    const sdk = storefront.publicStorefront();
    const { data } = await sdk.catalog.listCategories();
    const matched = matchCategory(data?.categories ?? [], category);
    if (matched?.name) displayName = matched.name;
    if (matched?.description) description = matched.description;
  } catch {}

  return {
    title: displayName,
    description,
    openGraph: {
      title: `${displayName} | ${SITE_NAME}`,
      description,
      type: "website",
      url: `${SITE_URL}/category/${category}`,
      images: OG_IMAGES,
    },
    twitter: {
      title: `${displayName} | ${SITE_NAME}`,
      description,
      images: [TWITTER_IMAGE],
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;

  let categories: Category[] = [];
  let skus: Item[] = [];
  let pagination: Pagination | undefined;
  let categoryName: string | undefined;
  let categoryDescription: string | undefined;

  try {
    const sdk = storefront.publicStorefront();

    const { data: categoriesData } = await sdk.catalog.listCategories();
    categories = categoriesData?.categories ?? [];
    const matched = matchCategory(categories, category);

    if (matched) {
      categoryName = matched.name;
      categoryDescription = matched.description ?? undefined;
    }

    if (categoryName) {
      try {
        const filter = buildFilter({}, categoryName);
        const { data } = await sdk.catalog.searchProducts({
          query: "",
          page: 1,
          limit: 12,
          ...(filter.length > 0 ? { filter } : {}),
        });

        skus = data?.skus ?? [];
        pagination = data?.pagination;
      } catch {
        skus = [];
      }
    }
  } catch {
    skus = [];
  }

  const displayName = categoryName ?? titleCase(category);
  const categoryUrl = `${SITE_URL}/category/${category}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: displayName,
      description: categoryDescription || PLP_COPY.subtitle,
      url: categoryUrl,
      ...(skus.length > 0
        ? {
            mainEntity: {
              "@type": "ItemList",
              itemListElement: skus.slice(0, 20).map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
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
        categoryName={categoryName}
        categoryDescription={categoryDescription}
        categories={categories}
        initialSkus={skus}
        initialPagination={pagination}
      />
    </>
  );
}
