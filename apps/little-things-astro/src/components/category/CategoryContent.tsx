import type { Item, Pagination } from "@commercengine/storefront";
import { useEffect, useMemo, useRef, useState } from "react";
import { buildFilter } from "@/lib/build-filter";
import { useCategories, useListSkus, useSearchProducts } from "@/lib/hooks";
import Providers from "../Providers";
import FilterSortBar from "./FilterSortBar";
import PLPHero from "./PlpHero";
import ProductGrid from "./ProductGrid";

interface CategoryContentProps {
  categorySlug?: string;
  initialSkus: Item[];
  initialPagination: Pagination | undefined;
}

export default function CategoryContent(props: CategoryContentProps) {
  return (
    <Providers>
      <CategoryContentInner {...props} />
    </Providers>
  );
}

function CategoryContentInner({
  categorySlug,
  initialSkus,
  initialPagination,
}: CategoryContentProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  const { categories } = useCategories();
  const matchedCategory = categorySlug
    ? categories.find(
        (c) => c.slug === categorySlug || c.name.toLowerCase().replace(/\s+/g, "-") === categorySlug
      )
    : undefined;
  const categoryId = matchedCategory?.id;
  const categoryName = matchedCategory?.name;

  const hasUserFilters = Object.keys(filters).length > 0;
  const hasPaginated = page > 1;

  const listSkusResult = useListSkus({
    page,
    limit: 20,
    category_id: categoryId ? [categoryId] : undefined,
    enabled: !hasUserFilters && hasPaginated,
  });

  const searchEnabled = hasUserFilters || filtersOpen;
  const filter = useMemo(() => buildFilter(filters, categoryName), [categoryName, filters]);

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

  const useInitialData = !hasUserFilters && !hasPaginated;
  const skus = hasUserFilters
    ? searchResult.skus
    : useInitialData
      ? initialSkus
      : listSkusResult.skus;
  const pagination = hasUserFilters
    ? searchResult.pagination
    : useInitialData
      ? initialPagination
      : listSkusResult.pagination;
  const isLoading = hasUserFilters
    ? searchResult.isLoading
    : useInitialData
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

  const displayName = categoryName ?? "All products";

  return (
    <main>
      <PLPHero
        title={displayName}
        subtitle="Everything in this corner of the shop, no fluff — just the good stuff."
      />

      <div className="pt-8">
        <FilterSortBar
          filtersOpen={filtersOpen}
          setFiltersOpen={setFiltersOpen}
          itemCount={pagination?.total_records ?? skus.length}
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
      </div>
    </main>
  );
}
