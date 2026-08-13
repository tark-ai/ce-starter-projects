import { cn } from "@ce/soja-ui/lib/utils";
import type * as React from "react";

export type PhotoBandHeight = "natural" | "screen" | "band" | "auto";
export type PhotoBandAlign = "top-left" | "bottom-left" | "bottom-right" | "center";

const HEIGHTS: Record<PhotoBandHeight, string> = {
  natural: "",
  screen: "min-h-dvh",
  band: "min-h-[85svh]",
  auto: "",
};

const ALIGNMENTS: Record<PhotoBandAlign, string> = {
  "top-left": "items-start justify-start text-left",
  "bottom-left": "items-start justify-end text-left",
  "bottom-right": "items-end justify-end text-left",
  center: "items-center justify-center text-center",
};

export interface PhotoBandProps {
  image: string;
  alt?: string;
  height?: PhotoBandHeight;
  align?: PhotoBandAlign;
  children?: React.ReactNode;
  overlay?: React.ReactNode;
  aspect?: string;
  focus?: "center" | "top" | "bottom";
  reveal?: boolean;
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
