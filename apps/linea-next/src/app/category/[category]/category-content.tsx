"use client";

import type { Item, Pagination } from "@commercengine/storefront";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import CategoryHeader from "@/components/category/CategoryHeader";
import FilterSortBar from "@/components/category/FilterSortBar";
import ProductGrid from "@/components/category/ProductGrid";
import { useCategories, useListSkus, useSearchProducts } from "@/lib/hooks";

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

interface CategoryContentProps {
  initialSkus: Item[];
  initialPagination: Pagination | undefined;
}

export function CategoryContent({ initialSkus, initialPagination }: CategoryContentProps) {
  const params = useParams();
  const category = decodeURIComponent(params.category as string);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  const { categories } = useCategories();
  const matchedCategory = categories.find((c) => c.slug === category);
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
