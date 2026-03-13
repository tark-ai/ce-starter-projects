import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import CategoryHeader from "@/components/category/CategoryHeader";
import FilterSortBar from "@/components/category/FilterSortBar";
import ProductGrid from "@/components/category/ProductGrid";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import { useCategories, useListSkus, useSearchProducts } from "@/lib/hooks";
import { storefront } from "@/lib/storefront";

const SITE_URL = "https://linea-static.demo.commercengine.io";
const SITE_NAME = "Linea";

function buildFilter(
  categoryName: string | undefined,
  userFilters: Record<string, unknown>
): (string | string[])[] {
  const conditions: (string | string[])[] = [];

  if (categoryName) {
    conditions.push(`categories.name = '${categoryName}'`);
  }

  const priceRange = userFilters.price_range as { min: number; max: number } | undefined;
  if (priceRange) {
    conditions.push(`pricing.selling_price ${priceRange.min} TO ${priceRange.max}`);
  }

  const minRating = userFilters.min_rating as number | undefined;
  if (minRating != null) {
    conditions.push(`rating >= ${minRating}`);
  }

  for (const [key, values] of Object.entries(userFilters)) {
    if (key === "price_range" || key === "min_rating") continue;
    if (!Array.isArray(values) || values.length === 0) continue;

    if (values.length === 1) {
      conditions.push(`${key} = '${values[0]}'`);
    } else {
      conditions.push(values.map((v: string) => `${key} = '${v}'`));
    }
  }

  return conditions;
}

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
  head: ({ params }) => {
    const displayName = params.category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const categoryUrl = `${SITE_URL}/category/${params.category}`;
    const description = `Shop ${displayName} from ${SITE_NAME}. Discover our curated collection of minimalist jewelry crafted for the modern individual.`;

    return {
      meta: [
        { title: `${displayName} | ${SITE_NAME}` },
        { name: "description", content: description },
        { property: "og:title", content: `${displayName} | ${SITE_NAME}` },
        { property: "og:type", content: "website" },
        { property: "og:url", content: categoryUrl },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: `${displayName} | ${SITE_NAME}` },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: categoryUrl }],
      scripts: [
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
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useParams();
  const loaderData = Route.useLoaderData();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  const { categories } = useCategories();
  const matchedCategory = categories.find((c) => c.slug === category);
  const categoryId = matchedCategory?.id ?? loaderData.categoryId;
  const categoryName = matchedCategory?.name ?? loaderData.categoryName;

  const hasUserFilters = Object.keys(filters).length > 0;
  const hasServerData = loaderData.serverSkus.length > 0;

  const listSkusResult = useListSkus({
    page,
    limit: 20,
    category_id: categoryId ? [categoryId] : undefined,
    enabled: !hasUserFilters && (!hasServerData || page > 1),
  });

  const searchEnabled = hasUserFilters || filtersOpen;
  const filter = useMemo(() => buildFilter(categoryName, filters), [categoryName, filters]);

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

  const shouldUseServerFallback = !hasUserFilters && page === 1 && hasServerData;
  const clientSkus = shouldUseServerFallback
    ? listSkusResult.skus.length > 0
      ? listSkusResult.skus
      : loaderData.serverSkus
    : listSkusResult.skus;
  const skus = hasUserFilters ? searchResult.skus : clientSkus;
  const clientPagination = shouldUseServerFallback
    ? (listSkusResult.pagination ?? loaderData.serverPagination)
    : listSkusResult.pagination;
  const pagination = hasUserFilters ? searchResult.pagination : clientPagination;
  const isLoading = hasUserFilters
    ? searchResult.isLoading
    : shouldUseServerFallback
      ? !hasServerData && listSkusResult.isLoading
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
    <div className="min-h-screen bg-background">
      <Header />

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

      <Footer />
    </div>
  );
}
