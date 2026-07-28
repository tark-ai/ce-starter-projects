import { useEffect, useMemo, useRef, useState } from "react";
import { buildFilter } from "@/lib/build-filter";
import { useSearchProducts } from "@/lib/hooks";
import Providers from "../Providers";
import FilterSortBar from "./FilterSortBar";
import PLPHero from "./PlpHero";
import ProductGrid from "./ProductGrid";

export default function SearchContent() {
  return (
    <Providers>
      <SearchContentInner />
    </Providers>
  );
}

function SearchContentInner() {
  const [query] = useState(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("q") ?? "";
  });

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  const prevQuery = useRef(query);
  useEffect(() => {
    if (prevQuery.current !== query) {
      prevQuery.current = query;
      setPage(1);
      setFilters({});
    }
  }, [query]);

  const hasUserFilters = Object.keys(filters).length > 0;
  const filter = useMemo(() => buildFilter(filters), [filters]);

  const searchResult = useSearchProducts({
    query,
    page,
    limit: 20,
    facets: ["*"],
    filter: filter.length > 0 ? filter : undefined,
    enabled: !!query,
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

  const currency = searchResult.skus[0]?.pricing?.currency ?? "INR";

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFiltersChange = (newFilters: Record<string, unknown>) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <main>
      <PLPHero query={query} />

      <div className="pt-8">
        <FilterSortBar
          filtersOpen={filtersOpen}
          setFiltersOpen={setFiltersOpen}
          itemCount={searchResult.pagination?.total_records ?? 0}
          currency={currency}
          baseFacetDistribution={baseFacetDistribution}
          baseFacetStats={baseFacetStats}
          facetDistribution={searchResult.facetDistribution}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        <ProductGrid
          skus={searchResult.skus}
          isLoading={searchResult.isLoading}
          pagination={searchResult.pagination}
          onPageChange={handlePageChange}
        />
      </div>
    </main>
  );
}
