import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import CategoryHeader from "../components/category/CategoryHeader";
import FilterSortBar from "../components/category/FilterSortBar";
import ProductGrid from "../components/category/ProductGrid";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import SEO, { SITE_NAME, SITE_URL } from "../components/Seo";
import { useCategories, useListSkus, useSearchProducts } from "../lib/hooks";

/**
 * Serialize structured filter state into a filter expression array
 * compatible with the searchProducts API.
 */
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
      // Multiple values for the same attribute → OR
      conditions.push(values.map((v: string) => `${key} = '${v}'`));
    }
  }

  return conditions;
}

const Category = () => {
  const { category } = useParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  const { categories } = useCategories();
  const matchedCategory = categories.find((c) => c.slug === category);
  const categoryId = matchedCategory?.id;
  const categoryName = matchedCategory?.name;

  const hasUserFilters = Object.keys(filters).length > 0;

  // Default: listSkus with category_id (no facets, fast)
  const listSkusResult = useListSkus({
    page,
    limit: 20,
    category_id: categoryId ? [categoryId] : undefined,
    enabled: !hasUserFilters,
  });

  // Faceted search: used when filters are active, or to load facets when filter sheet opens
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

  // Capture base (unfiltered) facet data so filter options stay stable
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

  // Use searchProducts results when user filters are active, otherwise listSkus
  const skus = hasUserFilters ? searchResult.skus : listSkusResult.skus;
  const pagination = hasUserFilters ? searchResult.pagination : listSkusResult.pagination;
  const isLoading = hasUserFilters ? searchResult.isLoading : listSkusResult.isLoading;
  const currency = skus[0]?.pricing?.currency ?? "INR";

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFiltersChange = (newFilters: Record<string, unknown>) => {
    setFilters(newFilters);
    setPage(1);
  };

  const displayName = categoryName ?? category ?? "All Products";
  const categoryUrl = `${SITE_URL}/category/${category}`;
  const categoryDescription = `Shop ${displayName} from ${SITE_NAME}. Discover our curated collection of minimalist jewelry crafted for the modern individual.`;

  const breadcrumbSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: displayName },
    ],
  };

  const collectionSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: displayName,
    description: categoryDescription,
    url: categoryUrl,
    ...(skus.length > 0
      ? {
          mainEntity: {
            "@type": "ItemList",
            itemListElement: skus.slice(0, 20).map((item, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${SITE_URL}/product/${item.product_slug}`,
              name: item.product_name,
            })),
          },
        }
      : {}),
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={displayName}
        description={categoryDescription}
        canonical={categoryUrl}
        jsonLd={[collectionSchema, breadcrumbSchema]}
      />
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
};

export default Category;
