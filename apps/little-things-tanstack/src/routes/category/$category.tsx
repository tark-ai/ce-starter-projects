import { safeJsonLd } from "@ce/little-things-ui/lib/json-ld";
import type { Item, Pagination } from "@commercengine/storefront";
import { createFileRoute } from "@tanstack/react-router";
import { CategoryView } from "@/components/category/CategoryView";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { storefront } from "@/lib/storefront";

export const Route = createFileRoute("/category/$category")({
  loader: async ({ params }) => {
    let skus: Item[] = [];
    let pagination: Pagination | undefined;
    let categoryName: string | undefined;

    try {
      const sdk = storefront.publicStorefront();
      const { data: categoriesData } = await sdk.catalog.listCategories();
      const categories = categoriesData?.categories ?? [];
      const matched = categories.find(
        (c) =>
          c.slug === params.category ||
          c.name.toLowerCase().replace(/\s+/g, "-") === params.category
      );
      categoryName = matched?.name;

      const { data: skusData } = await sdk.catalog.listSkus({
        page: 1,
        limit: 20,
        category_id: matched?.id ? [matched.id] : undefined,
      });
      skus = skusData?.skus ?? [];
      pagination = skusData?.pagination;
    } catch {
      skus = [];
    }

    return { skus, pagination, categoryName };
  },
  head: ({ params, loaderData }) => {
    const fallbackName = decodeURIComponent(params.category)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const displayName = loaderData?.categoryName ?? fallbackName;
    const categoryUrl = `${SITE_URL}/category/${params.category}`;
    const description = `Shop ${displayName} from ${SITE_NAME}. A tight, opinionated selection of everyday goods worth owning.`;

    const scripts: Array<{ type: string; children: string }> = [
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
      {
        type: "application/ld+json",
        children: safeJsonLd({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: displayName,
          description,
          url: categoryUrl,
          ...(loaderData?.skus && loaderData.skus.length > 0
            ? {
                mainEntity: {
                  "@type": "ItemList",
                  itemListElement: loaderData.skus.slice(0, 20).map((item, i) => ({
                    "@type": "ListItem",
                    position: i + 1,
                    url: `${SITE_URL}/product/${item.product_slug}`,
                    name: item.product_name,
                  })),
                },
              }
            : {}),
        }),
      },
    ];

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
      scripts,
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useParams();
  const { skus, pagination } = Route.useLoaderData();
  return <CategoryView categorySlug={category} initialSkus={skus} initialPagination={pagination} />;
}
