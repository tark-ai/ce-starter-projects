import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { formatPrice } from "@/lib/format";

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

const FilterSortBar = ({
  filtersOpen,
  setFiltersOpen,
  itemCount,
  currency,
  baseFacetDistribution,
  baseFacetStats,
  facetDistribution,
  filters,
  onFiltersChange,
}: FilterSortBarProps) => {
  const priceStats = baseFacetStats["pricing.selling_price"];
  const priceFilter = filters.price_range as { min: number; max: number } | undefined;
  const [priceRange, setPriceRange] = useState<[number, number]>([
    priceFilter?.min ?? priceStats?.min ?? 0,
    priceFilter?.max ?? priceStats?.max ?? 0,
  ]);

  // Sync local slider state when facetStats load or external filters change
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

  const clearAll = () => {
    onFiltersChange({});
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
                      onClick={clearAll}
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto space-y-8 py-6">
                {/* Price Range Slider */}
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

                {/* Checkbox facets: Categories, Metal */}
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

                {/* Rating Filter */}
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
};

export default FilterSortBar;
