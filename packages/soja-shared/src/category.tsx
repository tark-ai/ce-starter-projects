import { cn } from "@ce/soja-ui/lib/utils";
import type { Item, Pagination as PaginationType } from "@commercengine/storefront";
import { ProductCard, ProductCardSkeleton, Reveal } from "./content";
import type { SojaLinkComponent, SojaRoute } from "./lib/routing";
import type { SojaWishlistControls } from "./lib/wishlist";

/* -------------------------------------------------------------------------- */
/* PLPHero                                                                     */
/* -------------------------------------------------------------------------- */

export interface PLPHeroProps {
  title: string;
  subtitle?: string;
  /** Renders "Results for '…'" framing on the search page. */
  query?: string;
}

export function PLPHero({ title, subtitle, query }: PLPHeroProps) {
  return (
    <section className="soja-container pt-16 pb-12 tablet:pt-24 tablet:pb-16">
      <Reveal>
        <h1 className="font-display text-[2rem] tracking-display tablet:text-display">
          {query ? `Results for “${query}”` : title}
        </h1>
      </Reveal>
      {subtitle && (
        <Reveal delay={90}>
          <p className="mt-6 max-w-[600px] text-meta leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        </Reveal>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* CategoryFilterRow — plain text links, as in the reference                    */
/* -------------------------------------------------------------------------- */

export interface CategoryFilterItem {
  label: string;
  route: SojaRoute;
  /** Marks the currently viewed category. */
  active?: boolean;
}

export function CategoryFilterRow({
  items,
  LinkComponent,
}: {
  items: CategoryFilterItem[];
  LinkComponent: SojaLinkComponent;
}) {
  if (items.length === 0) return null;

  return (
    <nav className="soja-container flex flex-wrap gap-x-8 gap-y-3 border-b border-border pb-6">
      {items.map((item) => (
        <LinkComponent
          key={item.label}
          route={item.route}
          className={cn(
            "text-meta transition-opacity duration-300 ease-soja hover:opacity-60",
            item.active ? "underline underline-offset-[6px]" : "text-muted-foreground"
          )}
        >
          {item.label}
        </LinkComponent>
      ))}
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/* SortSelect                                                                  */
/* -------------------------------------------------------------------------- */

export const SORT_OPTIONS = [
  { value: "", label: "Featured" },
  { value: "selling_price:asc", label: "Price, low to high" },
  { value: "selling_price:desc", label: "Price, high to low" },
  { value: "created_at:desc", label: "Newest" },
] as const;

export function SortSelect({
  value,
  onChange,
  count,
}: {
  value: string;
  onChange: (value: string) => void;
  count?: number;
}) {
  return (
    <div className="soja-container flex items-center justify-between gap-6 py-6">
      <span className="text-meta text-muted-foreground">
        {typeof count === "number" ? `${count} ${count === 1 ? "product" : "products"}` : " "}
      </span>
      <label className="flex items-center gap-3 text-meta">
        <span className="text-muted-foreground">Sort</span>
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="border-0 border-b border-border bg-transparent py-1 text-meta outline-none focus:border-foreground"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ProductGrid                                                                 */
/* -------------------------------------------------------------------------- */

export interface ProductGridProps {
  skus: Item[];
  isLoading: boolean;
  LinkComponent: SojaLinkComponent;
  pagination?: PaginationType;
  onPageChange?: (page: number) => void;
  wishlist?: SojaWishlistControls;
  /** Shown when a filter or query returns nothing. */
  emptyMessage?: string;
}

export function ProductGrid({
  skus,
  isLoading,
  LinkComponent,
  pagination,
  onPageChange,
  wishlist,
  emptyMessage = "Nothing here yet. Try another category.",
}: ProductGridProps) {
  if (isLoading && skus.length === 0) {
    return (
      <div className="grid w-full grid-cols-2 gap-3 px-3 tablet:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length placeholder list
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (skus.length === 0) {
    return (
      <div className="soja-container py-24">
        <p className="font-display text-title tracking-display text-muted-foreground">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid w-full grid-cols-2 gap-3 px-3 tablet:grid-cols-3">
        {skus.map((item, index) => (
          <Reveal key={`${item.product_id}-${item.variant_id ?? index}`} delay={(index % 3) * 90}>
            <ProductCard item={item} LinkComponent={LinkComponent} wishlist={wishlist} />
          </Reveal>
        ))}
      </div>
      {pagination && onPageChange && (
        <Pagination pagination={pagination} onPageChange={onPageChange} />
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Pagination                                                                  */
/* -------------------------------------------------------------------------- */

export function Pagination({
  pagination,
  onPageChange,
}: {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
}) {
  // The API reports neighbours, not the current page: when there is a next page
  // the current one is the page before it, otherwise we are on the last page.
  const total = pagination.total_pages ?? 1;
  const current = pagination.next_page ? pagination.next_page - 1 : total;

  if (total <= 1) return null;

  return (
    <nav className="soja-container flex items-center justify-between gap-6 py-16">
      <button
        type="button"
        disabled={current <= 1}
        onClick={() => onPageChange(current - 1)}
        className="text-meta transition-opacity duration-300 ease-soja hover:opacity-60 disabled:pointer-events-none disabled:opacity-30"
      >
        Previous
      </button>
      <span className="text-meta text-muted-foreground">
        {current} / {total}
      </span>
      <button
        type="button"
        disabled={current >= total}
        onClick={() => onPageChange(current + 1)}
        className="text-meta transition-opacity duration-300 ease-soja hover:opacity-60 disabled:pointer-events-none disabled:opacity-30"
      >
        Next
      </button>
    </nav>
  );
}
