import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import CategoryHeader from "@/components/category/CategoryHeader";
import FilterSortBar from "@/components/category/FilterSortBar";
import ProductGrid from "@/components/category/ProductGrid";
import { buildFilter } from "@/lib/build-filter";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { useListSkus, useSearchProducts } from "@/lib/hooks";
import { storefront } from "@/lib/storefront";

export const Route = createFileRoute("/category/$category")({
  loader: async ({ params }) => {
    const sdk = storefront.publicStorefront();
    const { data: categoriesData, error: categoriesError } = await sdk.catalog.listCategories();
    if (categoriesError) throw new Error(categoriesError.message);
    const categories = categoriesData?.categories ?? [];
    const matched = categories.find((c) => c.slug === params.category);
    if (!matched)
      return {
        serverSkus: [],
        serverPagination: undefined,
        categoryId: undefined,
        categoryName: undefined,
      };
    const { data: result, error: skusError } = await sdk.catalog.listSkus({
      category_id: [matched.id],
      page: 1,
      limit: 20,
    });
    if (skusError) throw new Error(skusError.message);
    return {
      serverSkus: result?.skus ?? [],
      serverPagination: result?.pagination,
      categoryId: matched.id,
      categoryName: matched.name,
    };
  },
  head: ({ params, loaderData }) => {
    const displayName = params.category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const categoryUrl = `${SITE_URL}/category/${params.category}`;
    const description = `Shop ${displayName} from LINEA. Discover our curated collection of minimalist jewelry crafted for the modern individual.`;

    const scripts: Array<{ type: string; children: string }> = [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: SITE_URL,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: displayName,
              item: categoryUrl,
            },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: displayName,
          description,
          url: categoryUrl,
          ...(loaderData?.serverSkus && loaderData.serverSkus.length > 0
            ? {
                mainEntity: {
                  "@type": "ItemList",
                  itemListElement: loaderData.serverSkus.slice(0, 20).map((item, i) => ({
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
        { property: "og:image", content: `${SITE_URL}/og-image.jpg` },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: `${displayName} | ${SITE_NAME}` },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: `${SITE_URL}/og-image.jpg` },
      ],
      links: [{ rel: "canonical", href: categoryUrl }],
      scripts,
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useParams();
  const { serverSkus, serverPagination, categoryId, categoryName } = Route.useLoaderData();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  const hasUserFilters = Object.keys(filters).length > 0;
  const hasPaginated = page > 1;

  const listSkusResult = useListSkus({
    page,
    limit: 20,
    category_id: categoryId ? [categoryId] : undefined,
    enabled: !hasUserFilters && hasPaginated,
  });

  const searchEnabled = hasUserFilters || filtersOpen;
  const filter = useMemo(() => buildFilter(filters, { categoryName }), [categoryName, filters]);

  const searchResult = useSearchProducts({
    query: "",
    page,
    limit: 20,
    facets: ["*"],
    filter: filter.length > 0 ? filter : undefined,
    enabled: searchEnabled,
  });

  const baseFacetsRef = useRef({
    distribution: {} as Record<string, Record<string, number>>,
    stats: {} as Record<string, { min: number; max: number }>,
  });

  const searchDistribution = searchResult.facetDistribution;
  const searchStats = searchResult.facetStats;

  useEffect(() => {
    const hasData = Object.keys(searchDistribution).length > 0;
    if (!hasUserFilters && hasData) {
      baseFacetsRef.current = {
        distribution: searchDistribution,
        stats: searchStats,
      };
    }
  }, [hasUserFilters, searchDistribution, searchStats]);

  const baseFacetDistribution =
    Object.keys(baseFacetsRef.current.distribution).length > 0
      ? baseFacetsRef.current.distribution
      : searchDistribution;
  const baseFacetStats =
    Object.keys(baseFacetsRef.current.stats).length > 0 ? baseFacetsRef.current.stats : searchStats;

  const shouldUseInitialData = !hasUserFilters && !hasPaginated;
  const skus = hasUserFilters
    ? searchResult.skus
    : shouldUseInitialData
      ? serverSkus
      : listSkusResult.skus;
  const pagination = hasUserFilters
    ? searchResult.pagination
    : shouldUseInitialData
      ? serverPagination
      : listSkusResult.pagination;
  const isLoading = hasUserFilters
    ? searchResult.isLoading
    : shouldUseInitialData
      ? false
      : listSkusResult.isLoading;
  const currency = skus[0]?.pricing?.currency ?? "INR";

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFiltersChange = (newFilters: Record<string, unknown>) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <main className="pt-6">
      <CategoryHeader category={category || "All Products"} />

      <FilterSortBar
        filtersOpen={filtersOpen}
        setFiltersOpen={setFiltersOpen}
        itemCount={pagination?.total_records ?? 0}
        currency={currency}
        baseFacetDistribution={baseFacetDistribution}
        baseFacetStats={baseFacetStats}
        facetDistribution={searchResult.facetDistribution}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      <ProductGrid
        skus={skus}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </main>
  );
}
