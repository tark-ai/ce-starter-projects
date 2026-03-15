import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ce/ui/components/ui/breadcrumb";
import { Button } from "@ce/ui/components/ui/button";
import { Card, CardContent } from "@ce/ui/components/ui/card";
import { Checkbox } from "@ce/ui/components/ui/checkbox";
import { Label } from "@ce/ui/components/ui/label";
import { Separator } from "@ce/ui/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@ce/ui/components/ui/sheet";
import { Slider } from "@ce/ui/components/ui/slider";
import { formatPrice } from "@ce/ui/lib/format";
import type { Item, Pagination as PaginationType } from "@commercengine/storefront";
import { Image } from "@unpic/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { LineaLinkComponent } from "./lib/routing";
import { WishlistButton } from "./product";

interface CategoryHeaderProps {
  category: string;
  LinkComponent: LineaLinkComponent;
}

export function CategoryHeader({ category, LinkComponent }: CategoryHeaderProps) {
  const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <section className="w-full px-6 mb-8">
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <LinkComponent route={{ path: "/" }}>Home</LinkComponent>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{capitalizedCategory}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div>
        <h1 className="text-3xl md:text-4xl font-light text-foreground">{capitalizedCategory}</h1>
      </div>
    </section>
  );
}

interface FacetDistribution {
  [key: string]: { [value: string]: number };
}

interface FacetStats {
  [key: string]: { min: number; max: number };
}

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
}

const FILTER_LABELS: Record<string, string> = {
  "categories.name": "Category",
  "attribute.metal": "Metal",
  "attribute.material": "Material",
};

const RATING_OPTIONS = [4, 3, 2, 1] as const;

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

  const minRating = filters.min_rating as number | undefined;

  const setMinRating = (rating: number) => {
    const updated = { ...filters };
    if (minRating === rating) {
      delete updated.min_rating;
    } else {
      updated.min_rating = rating;
    }
    onFiltersChange(updated);
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  const checkboxFacets = (
    ["categories.name", "attribute.metal", "attribute.material"] as const
  ).filter((key) => {
    const values = baseFacetDistribution[key];
    return values && Object.keys(values).length > 0;
  });

  return (
    <section className="w-full px-6 mb-8 border-b border-border pb-4">
      <div className="flex justify-between items-center">
        <p className="text-sm font-light text-muted-foreground">{itemCount} items</p>

        <div className="flex items-center gap-4">
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="font-light hover:bg-transparent">
                Filters{hasActiveFilters ? " *" : ""}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-80 bg-background border-none shadow-none flex flex-col"
            >
              <SheetHeader className="border-b border-border pb-4">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-lg font-light">Filters</SheetTitle>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-transparent hover:underline font-light"
                      onClick={() => onFiltersChange({})}
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto space-y-8 py-6">
                {priceStats && priceStats.min < priceStats.max && (
                  <div>
                    <h3 className="text-sm font-light mb-4 text-foreground">Price</h3>
                    <Slider
                      min={priceStats.min}
                      max={priceStats.max}
                      step={1000}
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
                      {showSeparator && <Separator className="border-border mb-8" />}
                      <h3 className="text-sm font-light mb-4 text-foreground">
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
                                className="border-border data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
                              />
                              <Label
                                htmlFor={`${facetKey}-${value}`}
                                className={`text-sm font-light cursor-pointer ${
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

                {baseFacetDistribution.rating && (
                  <div>
                    <Separator className="border-border mb-8" />
                    <h3 className="text-sm font-light mb-4 text-foreground">Rating</h3>
                    <div className="space-y-3">
                      {RATING_OPTIONS.map((rating) => {
                        const liveRatings = facetDistribution.rating ?? {};
                        const count = Object.entries(liveRatings).reduce(
                          (sum, [r, c]) => (Number(r) >= rating ? sum + c : sum),
                          0
                        );

                        return (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setMinRating(rating)}
                            className={`flex items-center gap-2 text-sm font-light ${
                              minRating === rating ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            <span
                              className={
                                minRating === rating ? "text-amber-500" : "text-muted-foreground/50"
                              }
                            >
                              {"★".repeat(rating)}
                              {"☆".repeat(5 - rating)}
                            </span>
                            <span>& up ({count})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </section>
  );
}

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
    <section className="w-full px-6 py-8">
      <div className="flex justify-start items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="p-2 hover:bg-transparent hover:opacity-50 disabled:opacity-30 -ml-2"
          disabled={!pagination.previous_page}
          onClick={() => pagination.previous_page && onPageChange(pagination.previous_page)}
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
                variant="ghost"
                size="sm"
                className={`min-w-8 h-8 hover:bg-transparent hover:underline text-sm ${
                  page === currentPage ? "underline font-normal" : "font-light"
                }`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            )
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="p-2 hover:bg-transparent hover:opacity-50 disabled:opacity-30"
          disabled={!pagination.next_page}
          onClick={() => pagination.next_page && onPageChange(pagination.next_page)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}

interface ProductGridProps {
  skus: Item[];
  isLoading: boolean;
  pagination: PaginationType | undefined;
  onPageChange: (page: number) => void;
  LinkComponent: LineaLinkComponent;
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
      <section className="w-full px-6 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {skeletonIds.map((id) => (
            <div key={id}>
              <div className="aspect-square bg-muted/20 animate-pulse mb-3" />
              <div className="h-4 w-20 bg-muted/20 animate-pulse mb-1" />
              <div className="h-4 w-32 bg-muted/20 animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (skus.length === 0) {
    return (
      <section className="w-full px-6 mb-16">
        <p className="text-sm font-light text-muted-foreground py-12 text-center">
          No products found.
        </p>
      </section>
    );
  }

  return (
    <section className="w-full px-6 mb-16">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {skus.map((item) => (
          <LinkComponent
            key={item.sku}
            route={{
              path: `/product/${item.product_slug}`,
              search: item.variant_slug ? { variant: item.variant_slug } : undefined,
            }}
          >
            <Card className="border-none shadow-none bg-transparent group cursor-pointer">
              <CardContent className="p-0">
                <div className="aspect-square mb-3 overflow-hidden bg-muted/10 relative">
                  <Image
                    src={item.images?.[0]?.url_standard ?? ""}
                    alt={item.images?.[0]?.alternate_text || item.product_name}
                    layout="fullWidth"
                    className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-0"
                  />
                  <Image
                    src={item.images?.[1]?.url_standard || item.images?.[0]?.url_standard || ""}
                    alt={`${item.product_name} alternate`}
                    layout="fullWidth"
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-300 opacity-0 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-black/[0.03]" />
                  <WishlistButton
                    active={isInWishlist(item.product_id, item.variant_id)}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onToggleWishlist(item.product_id, item.variant_id);
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-light text-foreground">{item.categories?.[0]?.name}</p>
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-foreground">
                      {item.variant_name || item.product_name}
                    </h3>
                    <p className="text-sm font-light text-foreground">
                      {formatPrice(item.pricing.selling_price, item.pricing.currency)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </LinkComponent>
        ))}
      </div>

      {pagination && pagination.total_pages > 1 && (
        <Pagination pagination={pagination} onPageChange={onPageChange} />
      )}
    </section>
  );
}
