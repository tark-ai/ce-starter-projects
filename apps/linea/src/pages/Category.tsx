import { useState } from "react";
import { useParams } from "react-router-dom";
import CategoryHeader from "../components/category/CategoryHeader";
import FilterSortBar from "../components/category/FilterSortBar";
import ProductGrid from "../components/category/ProductGrid";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import { useSearchProducts } from "../lib/hooks";

const Category = () => {
  const { category } = useParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  const categoryFilter = category ? { category: [category] } : {};
  const mergedFilters = { ...categoryFilter, ...filters };
  const hasFilters = Object.keys(mergedFilters).length > 0;

  const { skus, facetDistribution, facetStats, pagination, isLoading } = useSearchProducts({
    query: "",
    page,
    limit: 20,
    facets: ["*"],
    filters: hasFilters ? mergedFilters : undefined,
  });

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
          facetDistribution={facetDistribution}
          facetStats={facetStats}
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
