import { cn } from "@ce/soja-ui/lib/utils";
import type * as React from "react";
import { Reveal } from "./content";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageHeader({ title, subtitle, className }: PageHeaderProps) {
  return (
    <header className={cn("soja-container pt-16 pb-12 tablet:pt-24 tablet:pb-20", className)}>
      <Reveal>
        <h1 className="font-display text-[2rem] tracking-display tablet:text-display">{title}</h1>
      </Reveal>
      {subtitle && (
        <Reveal delay={90}>
          <p className="mt-8 max-w-[600px] text-meta leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        </Reveal>
      )}
    </header>
  );
}

export interface ContentSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function ContentSection({ title, children, className }: ContentSectionProps) {
  return (
    <Reveal as="section" className={cn("soja-container py-10", className)}>
      {title && <h2 className="mb-6 font-display text-title tracking-display">{title}</h2>}
      <div className="max-w-[680px] space-y-5 text-meta leading-relaxed text-foreground/80">
        {children}
      </div>
    </Reveal>
  );
}

export interface ImageTextBlockProps {
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
    <Reveal
      as="section"
      className="soja-container grid items-center gap-10 py-16 tablet:grid-cols-2 tablet:gap-20 tablet:py-24"
    >
      <img
        src={image}
        alt={imageAlt}
        loading="lazy"
        decoding="async"
        className={cn(
          "aspect-4/3 w-full object-cover",
          imagePosition === "right" && "tablet:order-2"
        )}
      />
      <div className="flex flex-col gap-6">
        <h2 className="font-display text-title tracking-display">{title}</h2>
        <p className="max-w-[520px] text-meta leading-relaxed text-foreground/80">{content}</p>
      </div>
    </Reveal>
  );
}
