"use client";

import type { Item, Pagination } from "@commercengine/storefront";
import { useEffect, useMemo, useRef, useState } from "react";
import FilterSortBar from "@/components/category/FilterSortBar";
import PLPHero from "@/components/category/PlpHero";
import ProductGrid from "@/components/category/ProductGrid";
import { buildFilter } from "@/lib/build-filter";
import { useCategories, useListSkus, useSearchProducts } from "@/lib/hooks";

interface CategoryContentProps {
  categorySlug?: string;
  categoryId?: string;
  categoryName?: string;
  initialSkus: Item[];
  initialPagination: Pagination | undefined;
}

export function CategoryContent({
  categorySlug,
  categoryId: serverCategoryId,
  categoryName: serverCategoryName,
  initialSkus,
  initialPagination,
}: CategoryContentProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  // The server resolves the category from the URL and passes its identity down.
  // Only fetch categories on the client when we still need to resolve one
  // (e.g. a build without live credentials couldn't resolve it server-side).
  const needsClientResolve = Boolean(categorySlug) && !serverCategoryId;
  const { categories } = useCategories({ enabled: needsClientResolve });
  const clientMatched = needsClientResolve
    ? categories.find(
        (c) =>
          c.slug === categorySlug ||
          c.name.toLowerCase().replace(/\s+/g, "-") === categorySlug ||
          c.id === categorySlug
      )
    : undefined;

  const categoryId = serverCategoryId ?? clientMatched?.id;
  const categoryName = serverCategoryName ?? clientMatched?.name;

  // A category route whose category has not resolved yet: don't run
  // category-scoped requests, or they would return the whole catalog.
  const categoryPending = Boolean(categorySlug) && !categoryId;

  const hasUserFilters = Object.keys(filters).length > 0;
  const hasPaginated = page > 1;

  const listSkusResult = useListSkus({
    page,
    limit: 20,
    category_id: categoryId ? [categoryId] : undefined,
    enabled: !hasUserFilters && hasPaginated && !categoryPending,
  });

  const searchEnabled = (hasUserFilters || filtersOpen) && !categoryPending;
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

  const slugDisplayName = categorySlug
    ? (() => {
        const decoded = decodeURIComponent(categorySlug).replace(/-/g, " ");
        return decoded.charAt(0).toUpperCase() + decoded.slice(1);
      })()
    : undefined;
  const displayName = categoryName ?? slugDisplayName ?? "All products";

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
