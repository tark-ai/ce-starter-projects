import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

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
  facetDistribution: FacetDistribution;
  facetStats: FacetStats;
  filters: Record<string, unknown>;
  onFiltersChange: (filters: Record<string, unknown>) => void;
}

function formatFacetLabel(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const FilterSortBar = ({
  filtersOpen,
  setFiltersOpen,
  itemCount,
  facetDistribution,
  filters,
  onFiltersChange,
}: FilterSortBarProps) => {
  const facetKeys = Object.keys(facetDistribution);

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

  const clearAll = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

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
            <SheetContent side="right" className="w-80 bg-background border-none shadow-none">
              <SheetHeader className="mb-6 border-b border-border pb-4">
                <SheetTitle className="text-lg font-light">Filters</SheetTitle>
              </SheetHeader>

              <div className="space-y-8">
                {facetKeys.map((facetKey, idx) => {
                  const values = facetDistribution[facetKey];
                  if (!values || Object.keys(values).length === 0) return null;

                  return (
                    <div key={facetKey}>
                      {idx > 0 && <Separator className="border-border mb-8" />}
                      <h3 className="text-sm font-light mb-4 text-foreground">
                        {formatFacetLabel(facetKey)}
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(values).map(([value, count]) => (
                          <div key={value} className="flex items-center space-x-3">
                            <Checkbox
                              id={`${facetKey}-${value}`}
                              checked={isChecked(facetKey, value)}
                              onCheckedChange={() => toggleFilter(facetKey, value)}
                              className="border-border data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
                            />
                            <Label
                              htmlFor={`${facetKey}-${value}`}
                              className="text-sm font-light text-foreground cursor-pointer"
                            >
                              {value} ({count})
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {hasActiveFilters && (
                  <>
                    <Separator className="border-border" />
                    <div className="pt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full border-none hover:bg-transparent hover:underline font-light text-left justify-start"
                        onClick={clearAll}
                      >
                        Clear All
                      </Button>
                    </div>
                  </>
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
