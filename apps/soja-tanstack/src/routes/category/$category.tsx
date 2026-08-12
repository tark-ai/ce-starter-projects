import { safeJsonLd } from "@ce/soja-ui/lib/json-ld";
import type { Category, Item, Pagination } from "@commercengine/storefront";
import { createFileRoute } from "@tanstack/react-router";
import { CategoryView } from "@/components/category/CategoryView";
import { buildFilter } from "@/lib/build-filter";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { PLP_COPY } from "@/lib/site-content";
import { storefront } from "@/lib/storefront";

/** Slugs are matched loosely because a store may not define one for a category. */
function matchCategory(categories: Category[], slug: string) {
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

export const Route = createFileRoute("/category/$category")({
  loader: async ({ params }) => {
    let categories: Category[] = [];
    let skus: Item[] = [];
    let pagination: Pagination | undefined;
    let categoryName: string | undefined;
    let categoryDescription: string | undefined;

    try {
      const sdk = storefront.publicStorefront();

      const { data: categoriesData } = await sdk.catalog.listCategories();
      categories = categoriesData?.categories ?? [];
      const matched = matchCategory(categories, params.category);

      // Resolve the category identity before touching the catalog, so a later
      // SKU failure can't discard it.
      if (matched) {
        categoryName = matched.name;
        categoryDescription = matched.description ?? undefined;
      }

      // An unfiltered search would return the whole catalog under this heading.
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

    return { categories, skus, pagination, categoryName, categoryDescription };
  },
  head: ({ params, loaderData }) => {
    const displayName = loaderData?.categoryName ?? titleCase(params.category);
    const description = loaderData?.categoryDescription || PLP_COPY.subtitle;
    const categoryUrl = `${SITE_URL}/category/${params.category}`;
    const skus = loaderData?.skus ?? [];

    return {
      meta: [
        { title: `${displayName} | ${SITE_NAME}` },
        { name: "description", content: description },
        { property: "og:title", content: `${displayName} | ${SITE_NAME}` },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: categoryUrl },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: `${displayName} | ${SITE_NAME}` },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: categoryUrl }],
      scripts: [
        {
          type: "application/ld+json",
          children: safeJsonLd({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: displayName,
            description,
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
          }),
        },
        {
          type: "application/ld+json",
          children: safeJsonLd({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: displayName, item: categoryUrl },
            ],
          }),
        },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useParams();
  const { categories, skus, pagination, categoryName, categoryDescription } = Route.useLoaderData();

  return (
    <CategoryView
      categorySlug={category}
      categoryName={categoryName}
      categoryDescription={categoryDescription}
      categories={categories}
      initialSkus={skus}
      initialPagination={pagination}
    />
  );
}
