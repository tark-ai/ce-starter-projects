import { Button } from "@ce/little-things-ui/components/ui/button";
import { formatPrice } from "@ce/little-things-ui/lib/format";
import type { Item } from "@commercengine/storefront";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { LittleThingsLinkComponent, LittleThingsRoute } from "./lib/routing";
import { StorefrontImage } from "./lib/storefront-image";
import { LittleThingsLogo } from "./logo";

export interface NavigationCategory {
  name: string;
  slug?: string | null;
}

export interface NavigationImages {
  latestDrops?: string;
  seasonalGoods?: string;
  weeklyDeals?: string;
  allProducts?: string;
  logo?: string;
}

interface NavigationProps {
  LinkComponent: LittleThingsLinkComponent;
  categories: NavigationCategory[];
  wishlistItems: Item[];
  wishlistCount: number;
  removeFromWishlist: (productId: string, variantId?: string | null) => void;
  registerOnAdd: (listener: () => void) => () => void;
  cartCount: number;
  openCart: () => void;
  onSearchSubmit: (query: string) => void;
  images?: NavigationImages;
  cartSubtotal?: string;
}

const EXPLORE_LINKS: Array<{ label: string; route: LittleThingsRoute }> = [
  { label: "Blog", route: { path: "/blog" } },
  { label: "About", route: { path: "/about" } },
  { label: "Contact", route: { path: "/contact" } },
];

export function Navigation({
  LinkComponent,
  categories,
  wishlistItems,
  wishlistCount,
  removeFromWishlist,
  registerOnAdd,
  cartCount,
  openCart,
  onSearchSubmit,
  cartSubtotal,
}: NavigationProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [offCanvasType, setOffCanvasType] = useState<"favorites" | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => registerOnAdd(() => setOffCanvasType("favorites")), [registerOnAdd]);

  const getCategorySlug = (category: NavigationCategory) =>
    category.slug || category.name.toLowerCase().replace(/\s+/g, "-");

  const submitSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearchQuery("");
    setIsMenuOpen(false);
    onSearchSubmit(trimmed);
  };

  const openFavorites = () => {
    setIsMenuOpen(false);
    setOffCanvasType("favorites");
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-nav/95 backdrop-blur-sm">
      <div className="mx-auto flex h-20 max-w-[1400px] items-center gap-4 px-6 lg:px-20">
        {/* Left: dot-grid logo */}
        <LinkComponent route={{ path: "/" }} className="flex shrink-0 items-center">
          <LittleThingsLogo className="h-6 w-6 text-foreground" />
        </LinkComponent>

        {/* Center: prominent pill search */}
        <div className="flex min-w-0 flex-1 justify-center px-0 md:px-8">
          <div className="flex h-11 w-full max-w-xl items-center gap-2 rounded-full border border-border bg-background px-4">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="h-full w-full min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitSearch(searchQuery);
              }}
              aria-label="Search products"
            />
          </div>
        </div>

        {/* Right: Overview + cart + menu */}
        <div className="flex shrink-0 items-center gap-3">
          <LinkComponent
            route={{ path: "/about" }}
            className="hidden text-sm text-nav-foreground transition-colors hover:text-nav-hover sm:block"
          >
            Overview
          </LinkComponent>

          {cartSubtotal && (
            <span className="hidden text-sm font-medium text-foreground md:inline">
              {cartSubtotal}
            </span>
          )}

          <button
            type="button"
            className="relative grid size-10 place-items-center rounded-full bg-secondary text-foreground transition-colors hover:bg-accent"
            aria-label="Shopping bag"
            onClick={openCart}
          >
            <ShoppingBag className="size-4" />
            {cartCount > 0 && (
              <span className="pointer-events-none absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-brand text-[0.5rem] font-semibold text-brand-foreground">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className="grid size-10 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Full-width menu panel */}
      {isMenuOpen && (
        <div className="absolute inset-x-0 top-full z-50 border-b border-border bg-nav">
          <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-10 md:grid-cols-3 lg:px-20">
            <div>
              <p className="font-display text-2xl italic text-foreground">Shop</p>
              <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
                <li>
                  <LinkComponent
                    route={{ path: "/all-products" }}
                    className="block py-1 text-sm text-nav-foreground transition-colors hover:text-nav-hover"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    All products
                  </LinkComponent>
                </li>
                {categories.map((category) => (
                  <li key={category.name}>
                    <LinkComponent
                      route={{ path: `/category/${getCategorySlug(category)}` }}
                      className="block py-1 text-sm text-nav-foreground transition-colors hover:text-nav-hover"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </LinkComponent>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-display text-2xl italic text-foreground">Explore</p>
              <ul className="mt-4 space-y-2">
                {EXPLORE_LINKS.map((link) => (
                  <li key={link.label}>
                    <LinkComponent
                      route={link.route}
                      className="block py-1 text-sm text-nav-foreground transition-colors hover:text-nav-hover"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </LinkComponent>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={openFavorites}
                    className="flex items-center gap-1.5 py-1 text-sm text-nav-foreground transition-colors hover:text-nav-hover"
                  >
                    <Heart className="size-4" /> Favorites
                    {wishlistCount > 0 ? ` (${wishlistCount})` : ""}
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-display text-2xl italic text-foreground">Latest drops</p>
              <p className="mt-4 max-w-xs text-sm text-muted-foreground">
                Search for the latest drops and products from Little Things.
              </p>
              <Button asChild variant="secondary" size="sm" className="mt-6">
                <LinkComponent
                  route={{ path: "/all-products" }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  See all drops
                </LinkComponent>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Favorites off-canvas */}
      {offCanvasType === "favorites" && (
        <div className="fixed inset-0 z-50 h-screen">
          <button
            type="button"
            className="absolute inset-0 h-screen cursor-pointer border-0 bg-black/50 p-0"
            onClick={() => setOffCanvasType(null)}
            aria-label="Close favorites panel"
          />

          <div className="absolute right-0 top-0 flex h-screen w-96 max-w-full flex-col border-l border-border bg-background animate-slide-in-right">
            <div className="flex items-center justify-between border-b border-border p-6">
              <h2 className="font-display text-2xl italic text-foreground">Your favorites</h2>
              <button
                type="button"
                onClick={() => setOffCanvasType(null)}
                className="p-2 text-foreground transition-colors hover:text-muted-foreground"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {wishlistItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nothing saved yet. Tap the heart on things you love and we'll keep them right
                  here.
                </p>
              ) : (
                <div className="space-y-4">
                  {wishlistItems.map((item) => (
                    <div key={item.sku} className="flex gap-4">
                      <LinkComponent
                        route={{
                          path: `/product/${item.product_slug}`,
                          search: item.variant_slug ? { variant: item.variant_slug } : undefined,
                        }}
                        onClick={() => setOffCanvasType(null)}
                        className="shrink-0"
                      >
                        <StorefrontImage
                          image={item.images?.[0]}
                          alt={item.product_name}
                          variant="thumbnail"
                          width={80}
                          height={80}
                          loading="lazy"
                          className="size-20 bg-secondary object-contain"
                        />
                      </LinkComponent>
                      <div className="min-w-0 flex-1">
                        <LinkComponent
                          route={{
                            path: `/product/${item.product_slug}`,
                            search: item.variant_slug ? { variant: item.variant_slug } : undefined,
                          }}
                          onClick={() => setOffCanvasType(null)}
                          className="block"
                        >
                          <p className="truncate text-sm font-semibold text-foreground">
                            {item.variant_name || item.product_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(item.pricing.selling_price, item.pricing.currency)}
                          </p>
                        </LinkComponent>
                        <button
                          type="button"
                          onClick={() => removeFromWishlist(item.product_id, item.variant_id)}
                          className="mt-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
