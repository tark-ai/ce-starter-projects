import { formatPrice } from "@ce/soja-ui/lib/format";
import { cn } from "@ce/soja-ui/lib/utils";
import { Heart, X } from "lucide-react";
import type { SojaLinkComponent } from "./lib/routing";
import { StorefrontImage } from "./lib/storefront-image";
import type { SojaWishlistPanel } from "./lib/wishlist";

const WISHLIST_VARIANTS = {
  overlay: "p-1.5 text-white drop-shadow-[0_1px_3px_rgb(0_0_0/0.45)]",
  control:
    "flex h-12 w-12 shrink-0 items-center justify-center border border-border hover:border-foreground",
} as const;

export interface WishlistButtonProps {
  active: boolean;
  onClick: () => void;
  variant?: keyof typeof WISHLIST_VARIANTS;
  className?: string;
}

export function WishlistButton({
  active,
  onClick,
  variant = "overlay",
  className,
}: WishlistButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? "Remove from favourites" : "Add to favourites"}
      className={cn(
        "transition-[opacity,border-color] duration-300 ease-soja hover:opacity-60",
        WISHLIST_VARIANTS[variant],
        className
      )}
    >
      <Heart className={cn("h-4 w-4", active && "fill-current")} strokeWidth={1.25} />
    </button>
  );
}

export interface WishlistPanelProps {
  wishlist: SojaWishlistPanel;
  LinkComponent: SojaLinkComponent;
  open: boolean;
  onClose: () => void;
}

export function WishlistPanel({ wishlist, LinkComponent, open, onClose }: WishlistPanelProps) {
  if (!open) return null;

  const { items, removeFromWishlist } = wishlist;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close favourites"
        className="absolute inset-0 h-full w-full cursor-default bg-black/40"
      />

      <aside
        aria-label="Favourites"
        className="absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col border-l border-border bg-background text-foreground"
      >
        <div className="flex items-center justify-between gap-6 border-b border-border px-6 py-6">
          <h2 className="font-display text-title tracking-display">Favourites</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close favourites"
            className="transition-opacity duration-300 ease-soja hover:opacity-60"
          >
            <X className="h-5 w-5" strokeWidth={1.25} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8">
          {items.length === 0 ? (
            <p className="max-w-[280px] text-meta leading-relaxed text-muted-foreground">
              Nothing saved yet. Tap the heart on a formulation and it will wait for you here.
            </p>
          ) : (
            <ul className="flex flex-col gap-8">
              {items.map((item) => {
                const route = {
                  path: `/product/${item.product_slug}`,
                  search: item.variant_slug ? { variant: item.variant_slug } : undefined,
                };

                return (
                  <li
                    key={item.sku ?? `${item.product_id}-${item.variant_id}`}
                    className="flex gap-4"
                  >
                    <LinkComponent route={route} onClick={onClose} className="shrink-0">
                      <StorefrontImage
                        image={item.images?.[0]}
                        alt={item.product_name}
                        variant="thumbnail"
                        className="aspect-2/3 w-16 bg-accent object-cover"
                      />
                    </LinkComponent>

                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <LinkComponent
                        route={route}
                        onClick={onClose}
                        className="text-meta transition-opacity duration-300 ease-soja hover:opacity-60"
                      >
                        {item.variant_name || item.product_name}
                      </LinkComponent>
                      <p className="text-meta text-muted-foreground">
                        {formatPrice(item.pricing.selling_price, item.pricing.currency)}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(item.product_id, item.variant_id)}
                        className="mt-2 w-fit text-meta text-muted-foreground underline underline-offset-4 transition-colors duration-300 ease-soja hover:text-foreground"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
