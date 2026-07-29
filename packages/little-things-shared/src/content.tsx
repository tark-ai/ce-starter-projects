import { Badge } from "@ce/little-things-ui/components/ui/badge";
import { Button } from "@ce/little-things-ui/components/ui/button";
import { formatPrice } from "@ce/little-things-ui/lib/format";
import { images as defaultImages } from "@ce/little-things-ui/lib/images";
import type { Item } from "@commercengine/storefront";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { type Article, ArticleCard } from "./blog";
import type { LittleThingsLinkComponent, LittleThingsRoute } from "./lib/routing";
import { StorefrontImage } from "./lib/storefront-image";
import { WishlistButton } from "./product";

// Shared page container — centered, max 1400px, generous side gutters (matches reference).
const CONTAINER = "mx-auto w-full max-w-[1400px] px-6 lg:px-20";

// --- ProductCard (canonical, reused on PLP / PDP related) ---

interface ProductCardProps {
  item: Item;
  LinkComponent: LittleThingsLinkComponent;
  isInWishlist: (productId: string, variantId?: string | null) => boolean;
  onToggleWishlist: (productId: string, variantId?: string | null) => void;
}

export function ProductCard({
  item,
  LinkComponent,
  isInWishlist,
  onToggleWishlist,
}: ProductCardProps) {
  const inStock = item.stock_available || Boolean(item.backorder);

  return (
    <LinkComponent
      route={{
        path: `/product/${item.product_slug}`,
        search: item.variant_slug ? { variant: item.variant_slug } : undefined,
      }}
      className="group block"
    >
      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-secondary p-8">
        <StorefrontImage
          image={item.images?.[0]}
          alt={item.images?.[0]?.alternate_text || item.product_name}
          variant="standard"
          width={480}
          height={480}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
        {!inStock && (
          <Badge variant="secondary" className="absolute left-3 top-3">
            Last chance
          </Badge>
        )}
        <WishlistButton
          active={isInWishlist(item.product_id, item.variant_id)}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist(item.product_id, item.variant_id);
          }}
        />
      </div>
      <div className="mt-4 text-center">
        {item.categories?.[0]?.name && (
          <p className="text-sm text-muted-foreground">{item.categories[0].name}</p>
        )}
        <h3 className="mt-0.5 text-sm font-semibold text-foreground transition-colors group-hover:text-brand">
          {item.variant_name || item.product_name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatPrice(item.pricing.selling_price, item.pricing.currency)}
        </p>
      </div>
    </LinkComponent>
  );
}

// --- Hero ---

interface HeroProps {
  LinkComponent: LittleThingsLinkComponent;
  title?: string;
  serifLine?: string;
  sansLine?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaRoute?: LittleThingsRoute;
}

export function Hero({
  LinkComponent,
  serifLine = "Because basic is boring.",
  sansLine = "Upgrade your life.",
  subtitle = "Turn your boring routine into a highlight reel — you're welcome.",
  ctaLabel = "Browse all products",
  ctaRoute = { path: "/all-products" },
}: HeroProps) {
  return (
    <section className={`${CONTAINER} pb-12 pt-16 lg:pt-32`}>
      <h1 className="max-w-4xl leading-[0.95]">
        <span className="block font-display text-5xl italic md:text-7xl">{serifLine}</span>
        <span className="mt-1 block text-5xl font-bold tracking-tight md:text-7xl">{sansLine}</span>
      </h1>
      <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <p className="max-w-sm text-lg text-muted-foreground">{subtitle}</p>
        <Button asChild variant="secondary" size="lg" className="self-start md:self-auto">
          <LinkComponent route={ctaRoute}>{ctaLabel}</LinkComponent>
        </Button>
      </div>
    </section>
  );
}

// --- FeaturedProducts (3 showcase tiles) ---

interface FeaturedProductsProps {
  items: Item[];
  LinkComponent: LittleThingsLinkComponent;
  isInWishlist: (productId: string, variantId?: string | null) => boolean;
  onToggleWishlist: (productId: string, variantId?: string | null) => void;
  isLoading?: boolean;
  title?: string;
}

export function FeaturedProducts({
  items,
  LinkComponent,
  isLoading = false,
}: FeaturedProductsProps) {
  if (isLoading) {
    const skeletonIds = ["f1", "f2", "f3"];
    return (
      <section className={`${CONTAINER} py-6`}>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {skeletonIds.map((id) => (
            <div key={id} className="aspect-[4/5] animate-pulse bg-secondary" />
          ))}
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className={`${CONTAINER} py-6`}>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {items.slice(0, 3).map((item) => (
          <LinkComponent
            key={`${item.product_id}:${item.variant_id ?? "product"}`}
            route={{
              path: `/product/${item.product_slug}`,
              search: item.variant_slug ? { variant: item.variant_slug } : undefined,
            }}
            className="group flex flex-col bg-secondary p-8"
          >
            <div className="flex flex-1 items-center justify-center">
              <StorefrontImage
                image={item.images?.[0]}
                alt={item.images?.[0]?.alternate_text || item.product_name}
                variant="standard"
                width={560}
                height={560}
                className="max-h-72 w-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="mt-6 text-center">
              {item.categories?.[0]?.name && (
                <p className="text-sm text-muted-foreground">{item.categories[0].name}</p>
              )}
              <p className="mt-0.5 text-sm font-semibold text-foreground">
                {item.variant_name || item.product_name}
              </p>
            </div>
          </LinkComponent>
        ))}
      </div>
    </section>
  );
}

// --- Editorial category grid (serif-italic tiles) ---

interface EditorialItem {
  title: string;
  description: string;
  route: LittleThingsRoute;
  image?: string;
}

interface BrowseCategoriesProps {
  LinkComponent: LittleThingsLinkComponent;
  featured?: EditorialItem[];
  categories?: EditorialItem[];
  /** Real product image URLs, applied to the tiles in order (2 featured + 3 categories). */
  imageUrls?: string[];
}

const DEFAULT_FEATURED: EditorialItem[] = [
  {
    title: "Everything, dumped here.",
    description:
      "Too lazy to browse categories? We get it. Here's literally everything we sell in one place. Go wild.",
    route: { path: "/all-products" },
  },
  {
    title: "Freshly dropped. Still warm.",
    description: "The newest stuff we could slap a price tag on. Blink and it's gone—probably.",
    route: { path: "/all-products" },
  },
];

const DEFAULT_CATEGORIES: EditorialItem[] = [
  {
    title: "Seasonal goods only available online",
    description:
      "Only available online. Only for now. Only if you're fast. Miss it and it's gone till next year—or forever.",
    route: { path: "/all-products" },
  },
  {
    title: "This week's deals",
    description:
      "Blink and you'll miss it. Weekly deals that won't stick around—because good taste moves fast.",
    route: { path: "/all-products" },
  },
  {
    title: "Categories worth scrolling",
    description:
      "From headphones to holograms (eventually), explore all the good stuff by category. Your next obsession is here.",
    route: { path: "/all-products" },
  },
];

function EditorialTile({
  item,
  LinkComponent,
  imageClassName = "h-72 md:h-96",
}: {
  item: EditorialItem;
  LinkComponent: LittleThingsLinkComponent;
  imageClassName?: string;
}) {
  return (
    <LinkComponent route={item.route} className="group flex flex-col bg-secondary/60 p-8">
      <h3 className="font-display text-2xl italic text-foreground md:text-3xl">{item.title}</h3>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">{item.description}</p>
      <span className="mt-6 inline-grid size-10 place-items-center rounded-full border border-border bg-background text-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
        <ArrowRight size={16} />
      </span>
      <div className={`mt-8 flex items-end justify-center ${imageClassName}`}>
        {item.image && (
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="h-full w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
    </LinkComponent>
  );
}

export function BrowseCategories({
  LinkComponent,
  featured = DEFAULT_FEATURED,
  categories = DEFAULT_CATEGORIES,
  imageUrls,
}: BrowseCategoriesProps) {
  const withImage = (item: EditorialItem, index: number): EditorialItem => ({
    ...item,
    image: imageUrls?.[index] ?? item.image,
  });
  const featuredTiles = featured.map((item, i) => withImage(item, i));
  const categoryTiles = categories.map((item, i) => withImage(item, featured.length + i));

  return (
    <section className={`${CONTAINER} py-12`}>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {featuredTiles.map((item) => (
          <EditorialTile
            key={item.title}
            item={item}
            LinkComponent={LinkComponent}
            imageClassName="h-96 md:h-[500px]"
          />
        ))}
      </div>
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
        {categoryTiles.map((item) => (
          <EditorialTile key={item.title} item={item} LinkComponent={LinkComponent} />
        ))}
      </div>
    </section>
  );
}

// --- LatestArticles ---

const DEFAULT_ARTICLES: Article[] = [
  {
    slug: "sustainable-web-design-principles-and-practices",
    title: "Sustainable Web Design Principles and Practices",
    excerpt:
      "Sustainable web design is about creating websites that are environmentally friendly and efficient in terms of energy…",
    author: "Michael Andreuzza",
    date: "April 06, 2025",
    image: defaultImages.editorialOne,
    tags: ["web design", "sustainable"],
  },
  {
    slug: "the-rise-of-ai-in-web-development",
    title: "The Rise of AI in Web Development",
    excerpt:
      "Artificial Intelligence (AI) is transforming web development in ways we could only imagine a few years ago.",
    author: "Michael Andreuzza",
    date: "April 05, 2025",
    image: defaultImages.editorialTwo,
    tags: ["tech", "web development"],
  },
  {
    slug: "best-practices-for-responsive-web-design",
    title: "Best Practices for Responsive Web Design",
    excerpt:
      "Responsive web design (RWD) is essential in today's mobile-first world, but implementing it can be tricky.",
    author: "Michael Andreuzza",
    date: "April 04, 2025",
    image: defaultImages.editorialThree,
    tags: ["uiux", "web design"],
  },
];

interface LatestArticlesProps {
  LinkComponent: LittleThingsLinkComponent;
  articles?: Article[];
  heading?: string;
}

export function LatestArticles({
  LinkComponent,
  articles = DEFAULT_ARTICLES,
  heading = "Latest articles",
}: LatestArticlesProps) {
  return (
    <section className={`${CONTAINER} py-16`}>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-display text-3xl italic text-foreground md:text-4xl">{heading}</h2>
        <Button asChild variant="secondary" size="sm">
          <LinkComponent route={{ path: "/blog" }}>Read all articles</LinkComponent>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        {articles.slice(0, 3).map((article) => (
          <ArticleCard key={article.slug} article={article} LinkComponent={LinkComponent} />
        ))}
      </div>
    </section>
  );
}

// --- NewsletterBand (kept for optional use; not on the reference home) ---

interface NewsletterBandProps {
  heading?: string;
  onSubmit?: (email: string) => void;
}

export function NewsletterBand({
  heading = "We'll bribe you with 15% off your first order.",
  onSubmit,
}: NewsletterBandProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    onSubmit?.(trimmed);
    setEmail("");
  };

  return (
    <section className={`${CONTAINER} py-16`}>
      <div className="bg-secondary px-6 py-12 text-center md:px-12">
        <h2 className="mx-auto max-w-xl font-display text-3xl italic text-foreground md:text-4xl">
          {heading}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            aria-label="Email address"
            className="h-11 flex-1 rounded-full border border-input bg-background px-5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
          <Button type="submit" className="h-11">
            Sign me up
          </Button>
        </form>
      </div>
    </section>
  );
}
