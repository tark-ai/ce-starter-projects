import { formatPrice } from "@ce/soja-ui/lib/format";
import { images } from "@ce/soja-ui/lib/images";
import { cn } from "@ce/soja-ui/lib/utils";
import type { Item } from "@commercengine/storefront";
import * as React from "react";
import type { SojaLinkComponent, SojaRoute } from "./lib/routing";
import { StorefrontImage } from "./lib/storefront-image";
import type { SojaWishlistControls } from "./lib/wishlist";
import { PhotoBand } from "./photo-band";
import { WishlistButton } from "./wishlist";

/* -------------------------------------------------------------------------- */
/* Reveal — scroll-triggered entrance                                          */
/* -------------------------------------------------------------------------- */

/**
 * Content rises a little and fades in once, when it first enters the viewport.
 * `prefers-reduced-motion` is handled by the global rule in theme.css.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  // ElementType, so the shared ref isn't checked against the intersection of
  // every element the `as` union allows.
  const Tag = as as React.ElementType;
  const ref = React.useRef<HTMLElement>(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // No IntersectionObserver (older browsers, some SSR/test envs): show at once
    // rather than leaving the page permanently blank.
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    // Anything already on screen at mount reveals synchronously — the observer's
    // first callback is async, which would leave above-the-fold content invisible
    // for a frame or more.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-[1100ms] ease-soja motion-reduce:transition-none",
        shown ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0",
        className
      )}
      style={shown && delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/* EyebrowLink — the site's link affordance: label plus a filled square         */
/* -------------------------------------------------------------------------- */

export interface EyebrowLinkProps {
  label: string;
  route: SojaRoute;
  LinkComponent: SojaLinkComponent;
  className?: string;
}

export function EyebrowLink({ label, route, LinkComponent, className }: EyebrowLinkProps) {
  return (
    <LinkComponent
      route={route}
      className={cn(
        "group inline-flex items-center gap-2 text-meta transition-opacity duration-300 ease-soja hover:opacity-60",
        className
      )}
    >
      {label}
      <span
        aria-hidden
        className="h-1.5 w-1.5 bg-current transition-transform duration-500 ease-soja group-hover:translate-x-1"
      />
    </LinkComponent>
  );
}

/* -------------------------------------------------------------------------- */
/* SectionLede — the 28px display paragraph that heads each home section       */
/* -------------------------------------------------------------------------- */

export function SectionLede({
  children,
  className,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "p";
}) {
  return (
    <Tag className={cn("max-w-[600px] font-display text-title tracking-display", className)}>
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/* ProductCard — canonical, reused everywhere                                  */
/* -------------------------------------------------------------------------- */

export interface ProductCardProps {
  item: Item;
  LinkComponent: SojaLinkComponent;
  /** Cards sit on photographic bands as well as on bone. */
  tone?: "default" | "onPhoto";
  /**
   * Drop the name and price and render the photograph alone — for the card that
   * overlaps the testimonial band, where the meta would be clipped.
   */
  showMeta?: boolean;
  wishlist?: SojaWishlistControls;
  className?: string;
}

/**
 * Zero chrome by design: no fill, no border, no shadow, no padding. The 2:3
 * photograph *is* the card.
 */
export function ProductCard({
  item,
  LinkComponent,
  tone = "default",
  showMeta = true,
  wishlist,
  className,
}: ProductCardProps) {
  const name = item.variant_name || item.product_name;
  const primary = item.images?.[0];
  const secondary = item.images?.[1];

  return (
    // The favourite control is a sibling of the link, not a descendant: a button
    // nested inside an anchor is invalid and needs event-cancelling to work.
    <div className={cn("group relative", className)}>
      <LinkComponent
        route={{
          path: `/product/${item.product_slug}`,
          search: item.variant_slug ? { variant: item.variant_slug } : undefined,
        }}
        className="block"
      >
        <div className="relative aspect-2/3 overflow-hidden bg-accent">
          <StorefrontImage
            image={primary}
            alt={primary?.alternate_text || name}
            variant="standard"
            className={cn(
              "h-full w-full object-cover transition-[opacity,transform] duration-700 ease-soja",
              // With a second shot to reveal, the first simply fades out. Without
              // one, keep a slow zoom so the card still answers the cursor.
              secondary ? "group-hover:opacity-0" : "duration-[1200ms] group-hover:scale-[1.04]"
            )}
          />

          {/* Decorative: the first image already carries the product's alt text.
              Deliberately not preloaded — hover is a desktop-only affordance and
              this would otherwise double every listing's image payload. */}
          {secondary && (
            <StorefrontImage
              image={secondary}
              alt=""
              aria-hidden
              variant="standard"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 ease-soja group-hover:opacity-100"
            />
          )}

          {/* No stock badge, deliberately: `searchProducts` reports
              `stock_available: false` for every SKU while `listSkus` and
              `getProductDetail` report `true` for the same catalog. Stock state
              is shown on the PDP, where it is correct and blocks the purchase. */}
        </div>

        {showMeta && (
          <div className={cn("mt-4 flex flex-col gap-1", tone === "onPhoto" && "text-white")}>
            <h3 className="font-display text-body font-light tracking-display">{name}</h3>
            <p
              className={cn(
                "text-meta",
                tone === "onPhoto" ? "text-white/70" : "text-muted-foreground"
              )}
            >
              {formatPrice(item.pricing.selling_price, item.pricing.currency)}
            </p>
          </div>
        )}
      </LinkComponent>

      {wishlist && (
        <WishlistButton
          active={wishlist.isInWishlist(item.product_id, item.variant_id)}
          onClick={() => wishlist.onToggleWishlist(item.product_id, item.variant_id)}
          className="absolute top-3 right-3 z-10"
        />
      )}
    </div>
  );
}

/** Skeleton matching the card's 2:3 footprint, so grids don't reflow on load. */
export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-2/3 bg-accent" />
      <div className="mt-4 h-4 w-2/3 bg-accent" />
      <div className="mt-2 h-3 w-1/4 bg-accent" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ProductRow — full-bleed 4-across                                            */
/* -------------------------------------------------------------------------- */

export interface ProductRowProps {
  items: Item[];
  LinkComponent: SojaLinkComponent;
  isLoading?: boolean;
  /** How many cards to show — the reference runs rows of 4. */
  limit?: number;
  wishlist?: SojaWishlistControls;
  className?: string;
}

export function ProductRow({
  items,
  LinkComponent,
  isLoading = false,
  limit = 4,
  wishlist,
  className,
}: ProductRowProps) {
  const shown = items.slice(0, limit);

  if (isLoading && shown.length === 0) {
    return (
      <div className={cn("grid grid-cols-2 gap-3 tablet:grid-cols-4", className)}>
        {Array.from({ length: limit }, (_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length placeholder list
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (shown.length === 0) return null;

  return (
    <div className={cn("grid grid-cols-2 gap-3 tablet:grid-cols-4", className)}>
      {shown.map((item, index) => (
        <Reveal key={`${item.product_id}-${item.variant_id ?? index}`} delay={index * 90}>
          <ProductCard item={item} LinkComponent={LinkComponent} wishlist={wishlist} />
        </Reveal>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Hero — full-bleed 100vh photograph                                          */
/* -------------------------------------------------------------------------- */

export interface HeroProps {
  LinkComponent: SojaLinkComponent;
  title?: string;
  body?: string;
  ctaLabel?: string;
  ctaRoute?: SojaRoute;
  image?: string;
}

export function Hero({
  LinkComponent,
  title = "Rituals of natural skincare",
  body = "Experience the ritual of SOJA skincare. Our award-winning bioformulations are hand-crafted and balanced with ethically-sourced ingredients from our laboratory in Scandinavia.",
  ctaLabel = "Shop the collection",
  ctaRoute = { path: "/all-products" },
  image = images.hero,
}: HeroProps) {
  const words = title.split(" ");

  return (
    <PhotoBand
      image={image}
      // Capping at the viewport is what keeps the bottom-anchored copy inside the
      // first frame rather than below the fold on a wide monitor.
      height="screen"
      className="max-h-dvh"
      align="bottom-right"
      scrim="soft"
      contentClassName="flex justify-end"
    >
      <div className="flex max-w-[420px] flex-col gap-6">
        <h1 className="font-display text-[2.5rem] tracking-display tablet:text-display">
          {words.map((word, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: a title may repeat a word, so position is part of the identity
            <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom">
              <span
                className="inline-block animate-rise"
                style={{ animationDelay: `${200 + index * 90}ms` }}
              >
                {word}
                {index < words.length - 1 ? " " : ""}
              </span>
            </span>
          ))}
        </h1>

        <p
          className="animate-rise-slow text-meta leading-relaxed text-white/85"
          style={{ animationDelay: "620ms" }}
        >
          {body}
        </p>

        <div className="animate-rise-slow" style={{ animationDelay: "760ms" }}>
          <EyebrowLink label={ctaLabel} route={ctaRoute} LinkComponent={LinkComponent} />
        </div>
      </div>
    </PhotoBand>
  );
}

/* -------------------------------------------------------------------------- */
/* FeaturedProducts — lede + eyebrow + edge-to-edge row + optional CTAs        */
/* -------------------------------------------------------------------------- */

export interface FeaturedCta {
  label: string;
  route: SojaRoute;
  /** Supplying an image promotes the CTA row into full category tiles. */
  image?: string;
  imageAlt?: string;
}

export interface FeaturedProductsProps {
  items: Item[];
  LinkComponent: SojaLinkComponent;
  isLoading?: boolean;
  lede: string;
  eyebrow?: { label: string; route: SojaRoute };
  ctas?: FeaturedCta[];
  limit?: number;
  wishlist?: SojaWishlistControls;
}

export function FeaturedProducts({
  items,
  LinkComponent,
  isLoading,
  lede,
  eyebrow,
  ctas,
  limit = 4,
  wishlist,
}: FeaturedProductsProps) {
  const hasTiles = Boolean(ctas?.some((cta) => cta.image));

  return (
    <section className="py-20 tablet:py-28">
      <div className="soja-container flex flex-col gap-6">
        {eyebrow && (
          <Reveal>
            <EyebrowLink
              label={eyebrow.label}
              route={eyebrow.route}
              LinkComponent={LinkComponent}
              className="text-muted-foreground"
            />
          </Reveal>
        )}
        <Reveal delay={80}>
          <SectionLede>{lede}</SectionLede>
        </Reveal>
      </div>

      <div className="mt-16 w-full px-3 tablet:mt-24">
        <ProductRow
          items={items}
          LinkComponent={LinkComponent}
          isLoading={isLoading}
          limit={limit}
          wishlist={wishlist}
        />
      </div>

      {ctas &&
        ctas.length > 0 &&
        // Same gutter and gap as the product grid above, so the two blocks sit
        // on one edge.
        (hasTiles ? (
          <div className="mt-20 grid w-full grid-cols-1 gap-3 px-3 pb-4 tablet:mt-28 sm:grid-cols-2">
            {ctas.map((cta, index) => (
              <Reveal key={cta.label} delay={index * 90}>
                <CategoryTile cta={cta} LinkComponent={LinkComponent} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="soja-container mt-12 flex flex-wrap gap-x-10 gap-y-4">
            {ctas.map((cta) => (
              <EyebrowLink
                key={cta.label}
                label={cta.label}
                route={cta.route}
                LinkComponent={LinkComponent}
              />
            ))}
          </div>
        ))}
    </section>
  );
}

/** A category entry point: eyebrow label, then the 2:3 photograph beneath it. */
function CategoryTile({
  cta,
  LinkComponent,
}: {
  cta: FeaturedCta;
  LinkComponent: SojaLinkComponent;
}) {
  return (
    <LinkComponent route={cta.route} className="group block">
      <span className="mb-5 inline-flex items-center gap-2 text-meta transition-opacity duration-300 ease-soja group-hover:opacity-60">
        {cta.label}
        <span
          aria-hidden
          className="h-1.5 w-1.5 bg-current transition-transform duration-500 ease-soja group-hover:translate-x-1"
        />
      </span>
      <div className="relative aspect-2/3 overflow-hidden bg-accent">
        {cta.image && (
          <img
            src={cta.image}
            alt={cta.imageAlt ?? ""}
            aria-hidden={cta.imageAlt ? undefined : true}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-soja group-hover:scale-[1.04]"
          />
        )}
      </div>
    </LinkComponent>
  );
}

/* -------------------------------------------------------------------------- */
/* Testimonial — photographic band with an overlapping product card            */
/* -------------------------------------------------------------------------- */

export interface TestimonialProps {
  quote?: string;
  author?: string;
  image?: string;
  /** Card that overlaps the band's bottom-right corner. */
  featured?: Item;
  LinkComponent: SojaLinkComponent;
  wishlist?: SojaWishlistControls;
}

export function Testimonial({
  quote = "I've tried a lot of facial serums over the years, but matcha tea serum was by far the gentlest on my skin with a calming and restorative effect. I'm obsessed.",
  author = "Theresa Young · 42",
  image = images.testimonial,
  featured,
  LinkComponent,
  wishlist,
}: TestimonialProps) {
  return (
    <PhotoBand
      image={image}
      height="band"
      align="top-left"
      scrim="soft"
      overlay={
        featured ? (
          <ProductCard
            item={featured}
            LinkComponent={LinkComponent}
            tone="onPhoto"
            showMeta={false}
            wishlist={wishlist}
          />
        ) : undefined
      }
    >
      <figure className="flex max-w-[560px] flex-col gap-5">
        <blockquote className="font-display text-title tracking-display tablet:text-[2rem]">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <figcaption className="text-meta text-white/75">{author}</figcaption>
      </figure>
    </PhotoBand>
  );
}

/* -------------------------------------------------------------------------- */
/* BrandPillars — four Roman-numeral columns with hairline dividers            */
/* -------------------------------------------------------------------------- */

export interface Pillar {
  numeral: string;
  claim: string;
  image: string;
  imageAlt: string;
}

export const DEFAULT_PILLARS: Pillar[] = [
  {
    numeral: "I.",
    claim: "Complimentary international next-day shipping on all order above €100",
    image: images.pillarShipping,
    imageAlt: "Soja packaging resting on a river stone",
  },
  {
    numeral: "II.",
    claim: "Every product is arranged in our exquisite 100% recycled packaging",
    image: images.pillarPackaging,
    imageAlt: "Hands applying Soja product",
  },
  {
    numeral: "III.",
    claim: "Founded and operated out of beautiful Copenhagen, Denmark",
    image: images.pillarCopenhagen,
    imageAlt: "Portrait of a member of the Soja team",
  },
  {
    numeral: "IV.",
    claim: "We are committed to using ethically-sourced ingredients for all products",
    image: images.pillarSourcing,
    imageAlt: "Sea kelp beneath the water's surface",
  },
];

export function BrandPillars({ pillars = DEFAULT_PILLARS }: { pillars?: Pillar[] }) {
  return (
    <section className="py-24 tablet:py-36">
      <div className="soja-container grid grid-cols-1 gap-x-0 gap-y-12 sm:grid-cols-2 sm:gap-y-16 tablet:grid-cols-4">
        {pillars.map((pillar, index) => (
          <Reveal
            key={pillar.numeral}
            delay={index * 110}
            className={cn(
              // Mobile is a row — numeral and claim left, image right. From `sm`
              // up it becomes the stacked column the multi-column grid needs.
              "flex flex-row items-start gap-6 sm:flex-col sm:gap-0 tablet:px-8",
              index > 0 && "tablet:border-l tablet:border-border",
              index === 0 && "tablet:pl-0",
              index === pillars.length - 1 && "tablet:pr-0"
            )}
          >
            <div className="flex-1 sm:flex-none">
              <span className="text-meta text-muted-foreground">{pillar.numeral}</span>
              <p className="mt-6 max-w-[240px] text-meta leading-relaxed sm:mt-8">{pillar.claim}</p>
            </div>
            <img
              src={pillar.image}
              alt={pillar.imageAlt}
              loading="lazy"
              decoding="async"
              className="aspect-2/3 w-[38%] shrink-0 object-cover sm:mt-14 sm:w-full sm:max-w-[230px]"
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
