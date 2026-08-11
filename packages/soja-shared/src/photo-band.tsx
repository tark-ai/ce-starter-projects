import { cn } from "@ce/soja-ui/lib/utils";
import type * as React from "react";

/**
 * Soja's signature structural device: a full-bleed photograph with sticky white
 * copy on it and an optional card overlapping a corner. The hero, the homepage
 * testimonial and the footer are all the same construction.
 *
 * `natural` sizes the band to the photograph's own aspect ratio so the whole
 * frame stays visible; the viewport-height modes fill the screen but crop with
 * `object-cover`.
 */
export type PhotoBandHeight = "natural" | "screen" | "band" | "auto";
export type PhotoBandAlign = "top-left" | "bottom-left" | "bottom-right" | "center";

const HEIGHTS: Record<PhotoBandHeight, string> = {
  natural: "",
  // dvh, not vh: it settles correctly as mobile browser chrome collapses.
  screen: "min-h-dvh",
  band: "min-h-[85svh]",
  auto: "",
};

const ALIGNMENTS: Record<PhotoBandAlign, string> = {
  "top-left": "items-start justify-start text-left",
  "bottom-left": "items-end justify-start text-left",
  "bottom-right": "items-end justify-end text-left",
  center: "items-center justify-center text-center",
};

export interface PhotoBandProps {
  /** Full-bleed background photograph. */
  image: string;
  /** Decorative by default; pass a string when the photograph is content. */
  alt?: string;
  height?: PhotoBandHeight;
  align?: PhotoBandAlign;
  /** Sticky copy block laid over the photograph. */
  children?: React.ReactNode;
  /** Card or element overlapping the band's bottom-right corner. */
  overlay?: React.ReactNode;
  /** `natural` mode only. Defaults to the photo's own 3:2, which crops nothing. */
  aspect?: string;
  /** Which part of the photograph to keep when the band's ratio crops it. */
  focus?: "center" | "top" | "bottom";
  /** Wipe the photograph into view on mount. */
  reveal?: boolean;
  /** Darkens the photograph — only where copy needs the contrast. */
  scrim?: "none" | "soft" | "strong";
  className?: string;
  contentClassName?: string;
}

const FOCUS = {
  center: "object-center",
  top: "object-top",
  bottom: "object-bottom",
} as const;

const SCRIMS = {
  none: "",
  soft: "bg-gradient-to-t from-black/40 via-black/10 to-transparent",
  strong: "bg-black/40",
} as const;

export function PhotoBand({
  image,
  alt = "",
  height = "band",
  align = "bottom-left",
  children,
  overlay,
  aspect = "aspect-3/2",
  focus = "center",
  reveal = false,
  scrim = "none",
  className,
  contentClassName,
}: PhotoBandProps) {
  const isBottomAligned = align === "bottom-left" || align === "bottom-right";
  const isNatural = height === "natural";
  const isPriority = height === "screen" || isNatural;

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden bg-foreground",
        isNatural ? aspect : HEIGHTS[height],
        reveal && "animate-veil",
        className
      )}
    >
      <img
        src={image}
        alt={alt}
        aria-hidden={alt === "" ? true : undefined}
        className={cn("absolute inset-0 h-full w-full object-cover", FOCUS[focus])}
        loading={isPriority ? "eager" : "lazy"}
        fetchPriority={isPriority ? "high" : undefined}
        decoding="async"
      />

      {scrim !== "none" && <div aria-hidden className={cn("absolute inset-0", SCRIMS[scrim])} />}

      {children && (
        <div
          className={cn(
            "flex w-full flex-col",
            isNatural ? "absolute inset-0" : "relative",
            HEIGHTS[height],
            ALIGNMENTS[align]
          )}
        >
          <div
            className={cn(
              "soja-container w-full py-16 text-white tablet:py-24",
              // Only bottom-anchored copy pins: sticky on top-anchored copy
              // pushes it off the corner as soon as the band scrolls.
              isBottomAligned && !isNatural && "sticky bottom-12",
              contentClassName
            )}
          >
            {children}
          </div>
        </div>
      )}

      {overlay && (
        <div className="absolute right-0 bottom-0 z-10 w-[60%] max-w-[460px] translate-y-[10%] pr-3 tablet:w-[32%] tablet:pr-15">
          {overlay}
        </div>
      )}
    </section>
  );
}
