import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ce/ui/components/ui/breadcrumb";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import FilterSortBar from "@/components/category/FilterSortBar";
import ProductGrid from "@/components/category/ProductGrid";
import { buildFilter } from "@/lib/build-filter";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { useSearchProducts } from "@/lib/hooks";

export const Route = createFileRoute("/search/")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: (search.q as string) ?? "",
  }),
  head: () => ({
    meta: [
      {
        title: `Search | ${SITE_NAME}`,
      },
      {
        name: "description",
        content: "Search the full LINEA jewelry collection.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/search` }],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q: query } = Route.useSearch();

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
    <main className="pt-6">
      <section className="w-full px-6 mb-8">
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Search</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <h1 className="text-3xl md:text-4xl font-light text-foreground">
          Results for &ldquo;{query}&rdquo;
        </h1>
      </section>

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
    </main>
  );
}
