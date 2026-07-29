import { Button } from "@ce/little-things-ui/components/ui/button";
import { Checkbox } from "@ce/little-things-ui/components/ui/checkbox";
import { Label } from "@ce/little-things-ui/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ce/little-things-ui/components/ui/select";
import { Separator } from "@ce/little-things-ui/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@ce/little-things-ui/components/ui/sheet";
import { Slider } from "@ce/little-things-ui/components/ui/slider";
import { formatPrice } from "@ce/little-things-ui/lib/format";
import type { Item, Pagination as PaginationType } from "@commercengine/storefront";
import { ArrowRight, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ProductCard } from "./content";
import type { LittleThingsLinkComponent, LittleThingsRoute } from "./lib/routing";

export { ProductCard } from "./content";

// --- PLPHero ---

interface PLPHeroProps {
  title?: string;
  subtitle?: string;
  query?: string;
}

export function PLPHero({
  title = "Search all products.",
  subtitle = "Explore everything we offer in one place — no filters, no fluff.",
  query,
}: PLPHeroProps) {
  const heading = query ? `Results for "${query}"` : title;
  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 lg:px-20 py-16 md:py-20 border-b border-border">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">{heading}</h1>
      <p className="mt-4 text-lg font-light text-muted-foreground">{subtitle}</p>
    </section>
  );
}

// --- ProductSection ---

interface ProductSectionProps {
  title: string;
  items: Item[];
  LinkComponent: LittleThingsLinkComponent;
  isInWishlist: (productId: string, variantId?: string | null) => boolean;
  onToggleWishlist: (productId: string, variantId?: string | null) => void;
  description?: string;
  seeAllRoute?: LittleThingsRoute;
  seeAllLabel?: string;
}

export function ProductSection({
  title,
  items,
  LinkComponent,
  isInWishlist,
  onToggleWishlist,
  description,
  seeAllRoute,
  seeAllLabel = "See all",
}: ProductSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 lg:px-20 py-12">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{title}</h2>
          {description && (
            <p className="mt-2 max-w-xl text-sm font-light text-muted-foreground">{description}</p>
          )}
        </div>
        {seeAllRoute && (
          <LinkComponent
            route={seeAllRoute}
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-brand hover:opacity-80 transition-opacity"
          >
            <span>{seeAllLabel}</span>
            <ArrowRight size={14} />
          </LinkComponent>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <ProductCard
            key={item.sku}
            item={item}
            LinkComponent={LinkComponent}
            isInWishlist={isInWishlist}
            onToggleWishlist={onToggleWishlist}
          />
        ))}
      </div>
    </section>
  );
}

// --- FilterSortBar (optional / composable) ---

interface FacetDistribution {
  [key: string]: { [value: string]: number };
}

interface FacetStats {
  [key: string]: { min: number; max: number };
}

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
] as const;

const FILTER_LABELS: Record<string, string> = {
  "categories.name": "Category",
  "attribute.metal": "Metal",
  "attribute.material": "Material",
};

interface FilterSortBarProps {
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
  itemCount: number;
  currency: string;
  baseFacetDistribution: FacetDistribution;
  baseFacetStats: FacetStats;
  facetDistribution: FacetDistribution;
  filters: Record<string, unknown>;
  onFiltersChange: (filters: Record<string, unknown>) => void;
  sort?: string;
  onSortChange?: (sort: string) => void;
}

export function FilterSortBar({
  filtersOpen,
  setFiltersOpen,
  itemCount,
  currency,
  baseFacetDistribution,
  baseFacetStats,
  facetDistribution,
  filters,
  onFiltersChange,
  sort = "relevance",
  onSortChange,
}: FilterSortBarProps) {
  const priceStats = baseFacetStats["pricing.selling_price"];
  const priceFilter = filters.price_range as { min: number; max: number } | undefined;
  const [priceRange, setPriceRange] = useState<[number, number]>([
    priceFilter?.min ?? priceStats?.min ?? 0,
    priceFilter?.max ?? priceStats?.max ?? 0,
  ]);

  const pMin = priceStats?.min;
  const pMax = priceStats?.max;
  const fMin = priceFilter?.min;
  const fMax = priceFilter?.max;
  useEffect(() => {
    if (pMin != null && pMax != null) {
      setPriceRange([fMin ?? pMin, fMax ?? pMax]);
    }
  }, [pMin, pMax, fMin, fMax]);

  const isChecked = (facetKey: string, value: string): boolean => {
    const current = filters[facetKey];
    if (!Array.isArray(current)) return false;
    return current.includes(value);
  };

  const toggleFilter = (facetKey: string, value: string) => {
    const current = (filters[facetKey] as string[]) || [];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];

    const updated = { ...filters };
    if (next.length === 0) {
      delete updated[facetKey];
    } else {
      updated[facetKey] = next;
    }
    onFiltersChange(updated);
  };

  const applyPriceRange = useCallback(
    (range: [number, number]) => {
      const updated = { ...filters };
      if (priceStats && range[0] === priceStats.min && range[1] === priceStats.max) {
        delete updated.price_range;
      } else {
        updated.price_range = { min: range[0], max: range[1] };
      }
      onFiltersChange(updated);
    },
    [filters, priceStats, onFiltersChange]
  );

  const hasActiveFilters = Object.keys(filters).length > 0;

  const checkboxFacets = (
    ["categories.name", "attribute.metal", "attribute.material"] as const
  ).filter((key) => {
    const values = baseFacetDistribution[key];
    return values && Object.keys(values).length > 0;
  });

  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 lg:px-20 mb-8 flex items-center justify-between border-b border-border pb-4">
      <p className="text-sm font-light text-muted-foreground">{itemCount} items</p>

      <div className="flex items-center gap-4">
        {onSortChange && (
          <Select value={sort} onValueChange={onSortChange}>
            <SelectTrigger className="h-9 w-44 text-sm font-light">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters{hasActiveFilters ? " *" : ""}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 bg-background flex flex-col">
            <SheetHeader className="border-b border-border pb-4">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-lg font-bold">Filters</SheetTitle>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-light hover:bg-transparent hover:underline"
                    onClick={() => onFiltersChange({})}
                  >
                    Clear all
                  </Button>
                )}
              </div>
            </SheetHeader>

            <div className="flex-1 space-y-8 overflow-y-auto py-6">
              {priceStats && priceStats.min < priceStats.max && (
                <div>
                  <h3 className="mb-4 text-sm font-medium text-foreground">Price</h3>
                  <Slider
                    min={priceStats.min}
                    max={priceStats.max}
                    step={100}
                    value={priceRange}
                    onValueChange={(val) => setPriceRange(val as [number, number])}
                    onValueCommit={(val) => applyPriceRange(val as [number, number])}
                    className="mb-3"
                  />
                  <div className="flex justify-between text-xs font-light text-muted-foreground">
                    <span>{formatPrice(priceRange[0], currency)}</span>
                    <span>{formatPrice(priceRange[1], currency)}</span>
                  </div>
                </div>
              )}

              {checkboxFacets.map((facetKey, idx) => {
                const baseValues = baseFacetDistribution[facetKey];
                const liveValues = facetDistribution[facetKey] ?? {};
                const showSeparator = idx > 0 || (priceStats && priceStats.min < priceStats.max);

                return (
                  <div key={facetKey}>
                    {showSeparator && <Separator className="mb-8" />}
                    <h3 className="mb-4 text-sm font-medium text-foreground">
                      {FILTER_LABELS[facetKey] ?? facetKey}
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(baseValues).map(([value]) => {
                        const count = liveValues[value] ?? 0;
                        const disabled = count === 0 && !isChecked(facetKey, value);

                        return (
                          <div key={value} className="flex items-center space-x-3">
                            <Checkbox
                              id={`${facetKey}-${value}`}
                              checked={isChecked(facetKey, value)}
                              onCheckedChange={() => toggleFilter(facetKey, value)}
                              disabled={disabled}
                            />
                            <Label
                              htmlFor={`${facetKey}-${value}`}
                              className={`cursor-pointer text-sm font-light ${
                                disabled ? "text-muted-foreground/50" : "text-foreground"
                              }`}
                            >
                              {value} ({count})
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </section>
  );
}

// --- Pagination (optional / composable) ---

interface PaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
}

function getPageNumbers(
  totalPages: number,
  currentPage: number
): (number | { type: "ellipsis"; id: "start" | "end" })[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | { type: "ellipsis"; id: "start" | "end" })[] = [1];

  if (currentPage > 3) pages.push({ type: "ellipsis", id: "start" });

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) pages.push({ type: "ellipsis", id: "end" });

  pages.push(totalPages);
  return pages;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const currentPage = pagination.next_page ? pagination.next_page - 1 : pagination.total_pages;
  const pages = getPageNumbers(pagination.total_pages, currentPage);

  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 lg:px-20 py-8">
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="p-2 disabled:opacity-30"
          disabled={!pagination.previous_page}
          onClick={() => pagination.previous_page && onPageChange(pagination.previous_page)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {pages.map((page) =>
            typeof page === "object" ? (
              <span
                key={`ellipsis-${page.id}`}
                className="mx-2 text-sm font-light text-muted-foreground"
              >
                ...
              </span>
            ) : (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "ghost"}
                size="sm"
                className="h-9 min-w-9 text-sm"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            )
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="p-2 disabled:opacity-30"
          disabled={!pagination.next_page}
          onClick={() => pagination.next_page && onPageChange(pagination.next_page)}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}

// --- ProductGrid ---

interface ProductGridProps {
  skus: Item[];
  isLoading: boolean;
  pagination: PaginationType | undefined;
  onPageChange: (page: number) => void;
  LinkComponent: LittleThingsLinkComponent;
  isInWishlist: (productId: string, variantId?: string | null) => boolean;
  onToggleWishlist: (productId: string, variantId?: string | null) => void;
}

export function ProductGrid({
  skus,
  isLoading,
  pagination,
  onPageChange,
  LinkComponent,
  isInWishlist,
  onToggleWishlist,
}: ProductGridProps) {
  if (isLoading) {
    const skeletonIds = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];
    return (
      <section className="mx-auto w-full max-w-[1400px] px-6 lg:px-20 mb-16">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
          {skeletonIds.map((id) => (
            <div key={id}>
              <div className="mb-3 aspect-[4/3] animate-pulse rounded-lg bg-muted" />
              <div className="mb-1 h-4 w-20 animate-pulse bg-muted" />
              <div className="h-4 w-32 animate-pulse bg-muted" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (skus.length === 0) {
    return (
      <section className="mx-auto w-full max-w-[1400px] px-6 lg:px-20 mb-16">
        <p className="py-12 text-center text-sm font-light text-muted-foreground">
          Nothing here yet. Even our search came up empty — try something else?
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 lg:px-20 mb-16">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
        {skus.map((item) => (
          <ProductCard
            key={item.sku}
            item={item}
            LinkComponent={LinkComponent}
            isInWishlist={isInWishlist}
            onToggleWishlist={onToggleWishlist}
          />
        ))}
      </div>

      {pagination && pagination.total_pages > 1 && (
        <Pagination pagination={pagination} onPageChange={onPageChange} />
      )}
    </section>
  );
}
