import { Button } from "@ce/little-things-ui/components/ui/button";
import type * as React from "react";
import type { LittleThingsLinkComponent, LittleThingsRoute } from "./lib/routing";

// --- PageHeader / Hero ---

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  LinkComponent?: LittleThingsLinkComponent;
  ctaLabel?: string;
  ctaRoute?: LittleThingsRoute;
}

export function PageHeader({
  title,
  subtitle,
  LinkComponent,
  ctaLabel,
  ctaRoute,
}: PageHeaderProps) {
  return (
    <header className="w-full px-6 py-20 md:py-28 border-b border-border">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">{title}</h1>
        {subtitle && (
          <p className="mt-6 text-lg font-light leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        )}
        {LinkComponent && ctaLabel && ctaRoute && (
          <div className="mt-8">
            <Button asChild size="lg">
              <LinkComponent route={ctaRoute}>{ctaLabel}</LinkComponent>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

// Hero is an alias of PageHeader for parity with the home/PLP/blog heroes.
export const Hero = PageHeader;

// --- ContentSection ---

interface ContentSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function ContentSection({ title, children, className = "" }: ContentSectionProps) {
  return (
    <section className={`w-full px-6 py-16 ${className}`}>
      <div className="mx-auto max-w-3xl">
        {title && (
          <h2 className="mb-8 text-3xl font-bold tracking-tight text-foreground">{title}</h2>
        )}
        <div className="space-y-6 text-base font-light leading-relaxed text-muted-foreground">
          {children}
        </div>
      </div>
    </section>
  );
}

// --- ImageTextBlock ---

interface ImageTextBlockProps {
  image: string;
  imageAlt: string;
  title: string;
  content: string;
  imagePosition?: "left" | "right";
}

export function ImageTextBlock({
  image,
  imageAlt,
  title,
  content,
  imagePosition = "left",
}: ImageTextBlockProps) {
  return (
    <section className="w-full px-6 py-16">
      <div
        className={`mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 lg:grid-cols-2 ${
          imagePosition === "right" ? "lg:[&>*:first-child]:order-last" : ""
        }`}
      >
        <div className="aspect-[4/3] overflow-hidden rounded-lg bg-muted/40">
          <img
            src={image}
            alt={imageAlt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-bold tracking-tight text-foreground">{title}</h3>
          <p className="text-base font-light leading-relaxed text-muted-foreground">{content}</p>
        </div>
      </div>
    </section>
  );
}
