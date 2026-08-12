import { cn } from "@ce/soja-ui/lib/utils";
import { Heart, Menu, Search, X } from "lucide-react";
import * as React from "react";
import type { SojaLinkComponent, SojaRoute } from "./lib/routing";
import type { SojaWishlistPanel } from "./lib/wishlist";
import { SojaWordmark } from "./logo";
import { WishlistPanel } from "./wishlist";

export interface NavigationCategory {
  name: string;
  slug?: string | null;
}

export interface NavigationProps {
  LinkComponent: SojaLinkComponent;
  categories: NavigationCategory[];
  cartCount: number;
  openCart: () => void;
  onSearchSubmit: (query: string) => void;
  wishlist?: SojaWishlistPanel;
  overHero?: boolean;
}

const NAV_LINKS: Array<{ label: string; route: SojaRoute }> = [
  { label: "Shop", route: { path: "/all-products" } },
  { label: "Our story", route: { path: "/about" } },
];

const SCROLL_THRESHOLD = 80;

export function Navigation({
  LinkComponent,
  categories,
  cartCount,
  openCart,
  onSearchSubmit,
  wishlist,
  overHero = false,
}: NavigationProps) {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [favouritesOpen, setFavouritesOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    if (!overHero) return;
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overHero]);

  const registerOnAdd = wishlist?.registerOnAdd;
  React.useEffect(() => registerOnAdd?.(() => setFavouritesOpen(true)), [registerOnAdd]);

  // The drawer and its toggle are hidden from `tablet` up, so growing past the
  // breakpoint would otherwise leave the scroll lock on with no way to clear it.
  React.useEffect(() => {
    if (!menuOpen) return;
    const query = window.matchMedia("(min-width: 50.625rem)");
    const closeIfWide = () => {
      if (query.matches) setMenuOpen(false);
    };
    closeIfWide();
    query.addEventListener("change", closeIfWide);
    return () => query.removeEventListener("change", closeIfWide);
  }, [menuOpen]);

  const locked = menuOpen || favouritesOpen;
  React.useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);

  const onPhoto = overHero && !scrolled && !menuOpen;

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearchSubmit(trimmed);
    setSearchOpen(false);
    setMenuOpen(false);
    setQuery("");
  };

  const openFavourites = () => {
    setMenuOpen(false);
    setFavouritesOpen(true);
  };

  const categoryLinks = categories
    .filter((category) => category.slug)
    .slice(0, 6)
    .map((category) => ({
      label: category.name,
      route: { path: `/category/${category.slug}` } as SojaRoute,
    }));

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-500 ease-soja",
        onPhoto ? "bg-transparent text-white" : "bg-background text-foreground"
      )}
    >
      <div className="soja-container flex h-20 items-center justify-between gap-6">
        <LinkComponent
          route={{ path: "/" }}
          className="shrink-0 transition-opacity hover:opacity-70"
        >
          <SojaWordmark />
        </LinkComponent>

        <nav className="hidden items-center gap-9 tablet:flex">
          {NAV_LINKS.map((link) => (
            <LinkComponent
              key={link.label}
              route={link.route}
              className="text-meta transition-opacity duration-300 ease-soja hover:opacity-60"
            >
              {link.label}
            </LinkComponent>
          ))}

          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            aria-label="Search"
            aria-expanded={searchOpen}
            className="transition-opacity duration-300 ease-soja hover:opacity-60"
          >
            <Search className="h-4 w-4" strokeWidth={1.25} />
          </button>

          {wishlist && <FavouritesButton count={wishlist.count} onClick={openFavourites} />}

          <CartButton count={cartCount} onClick={openCart} />
        </nav>

        <div className="flex items-center gap-5 tablet:hidden">
          {wishlist && <FavouritesButton count={wishlist.count} onClick={openFavourites} />}
          <CartButton count={cartCount} onClick={openCart} />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="h-5 w-5" strokeWidth={1.25} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.25} />
            )}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="hidden border-t border-border bg-background text-foreground tablet:block">
          <form onSubmit={submitSearch} className="soja-container py-5">
            <input
              // biome-ignore lint/a11y/noAutofocus: the field only exists once deliberately opened
              autoFocus
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              aria-label="Search products"
              className="w-full border-0 bg-transparent font-display text-title tracking-display outline-none placeholder:text-muted-foreground"
            />
          </form>
        </div>
      )}

      {menuOpen && (
        <div className="fixed inset-x-0 top-20 bottom-0 z-40 overflow-y-auto bg-background text-foreground tablet:hidden">
          <div className="soja-container flex flex-col gap-10 py-10">
            <form onSubmit={submitSearch} className="border-b border-border pb-4">
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search"
                aria-label="Search products"
                className="w-full border-0 bg-transparent font-display text-title tracking-display outline-none placeholder:text-muted-foreground"
              />
            </form>

            <nav className="flex flex-col gap-6">
              {NAV_LINKS.map((link) => (
                <LinkComponent
                  key={link.label}
                  route={link.route}
                  onClick={() => setMenuOpen(false)}
                  className="font-display text-title tracking-display"
                >
                  {link.label}
                </LinkComponent>
              ))}
              {wishlist && (
                <button
                  type="button"
                  onClick={openFavourites}
                  className="w-fit font-display text-title tracking-display"
                >
                  Favourites{wishlist.count > 0 ? ` (${wishlist.count})` : ""}
                </button>
              )}
            </nav>

            {categoryLinks.length > 0 && (
              <div className="flex flex-col gap-4 border-t border-border pt-8">
                {categoryLinks.map((link) => (
                  <LinkComponent
                    key={link.label}
                    route={link.route}
                    onClick={() => setMenuOpen(false)}
                    className="text-meta text-muted-foreground"
                  >
                    {link.label}
                  </LinkComponent>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {wishlist && (
        <WishlistPanel
          wishlist={wishlist}
          LinkComponent={LinkComponent}
          open={favouritesOpen}
          onClose={() => setFavouritesOpen(false)}
        />
      )}
    </header>
  );
}

function FavouritesButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open favourites, ${count} ${count === 1 ? "item" : "items"}`}
      className="relative transition-opacity duration-300 ease-soja hover:opacity-60"
    >
      <Heart className="h-4 w-4" strokeWidth={1.25} />
      {count > 0 && (
        <span aria-hidden className="absolute -top-2 -right-2 text-[0.625rem] leading-none">
          {count}
        </span>
      )}
    </button>
  );
}

function CartButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-current text-xs transition-opacity duration-300 ease-soja hover:opacity-60"
    >
      {count}
    </button>
  );
}
