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
  // Start empty on both SSR and the first client render so hydration matches the
  // server-rendered markup. Read the actual query from the URL only after mount.
  const [query, setQuery] = useState("");
  // `ready` is false on the server render AND the first client paint, so the
  // hydration HTML matches and no mismatch occurs. It flips true in the mount
  // effect once the URL query has been read. Until then we render a skeleton
  // over the hero area instead of the empty-hero state, avoiding the flash.
  const [ready, setReady] = useState(false);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  useEffect(() => {
    setQuery(new URLSearchParams(window.location.search).get("q") ?? "");
    setReady(true);
  }, []);

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

  if (!ready) {
    // Placeholder covering the hero area while the URL query is read on mount.
    // Matches the hero's spacing so there's no layout shift, and identical on
    // SSR + first client paint so hydration stays consistent.
    return (
      <main>
        <section className="mx-auto w-full max-w-[1400px] px-6 lg:px-20 py-16 md:py-20 border-b border-border">
          <div className="h-10 md:h-12 w-3/4 max-w-xl bg-muted/20 animate-pulse rounded" />
          <div className="mt-4 h-6 w-1/2 max-w-md bg-muted/20 animate-pulse rounded" />
        </section>
      </main>
    );
  }

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
