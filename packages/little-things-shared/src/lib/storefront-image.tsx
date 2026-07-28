import type * as React from "react";

type StorefrontImageSource = {
  url_tiny?: string | null;
  url_thumbnail?: string | null;
  url_standard?: string | null;
  url_zoom?: string | null;
};

type StorefrontImageVariant = "tiny" | "thumbnail" | "standard" | "zoom";

interface StorefrontImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "alt" | "src" | "srcSet"> {
  alt: string;
  image: StorefrontImageSource | null | undefined;
  variant?: StorefrontImageVariant;
}

const SRC_FALLBACKS: Record<StorefrontImageVariant, Array<keyof StorefrontImageSource>> = {
  tiny: ["url_tiny", "url_thumbnail", "url_standard", "url_zoom"],
  thumbnail: ["url_thumbnail", "url_standard", "url_zoom", "url_tiny"],
  standard: ["url_standard", "url_zoom", "url_thumbnail", "url_tiny"],
  zoom: ["url_zoom", "url_standard", "url_thumbnail", "url_tiny"],
};

const SRCSET_VARIANTS: Record<
  StorefrontImageVariant,
  Array<{ density: "1x" | "2x"; key: keyof StorefrontImageSource }>
> = {
  tiny: [
    { density: "1x", key: "url_tiny" },
    { density: "2x", key: "url_thumbnail" },
  ],
  thumbnail: [
    { density: "1x", key: "url_thumbnail" },
    { density: "2x", key: "url_standard" },
  ],
  standard: [
    { density: "1x", key: "url_standard" },
    { density: "2x", key: "url_zoom" },
  ],
  zoom: [{ density: "1x", key: "url_zoom" }],
};

function resolveSrc(
  image: StorefrontImageSource | null | undefined,
  variant: StorefrontImageVariant
): string | null {
  if (!image) return null;

  for (const key of SRC_FALLBACKS[variant]) {
    const candidate = image[key];
    if (candidate) return candidate;
  }

  return null;
}

function buildSrcSet(
  image: StorefrontImageSource | null | undefined,
  variant: StorefrontImageVariant,
  fallbackSrc: string
): string | undefined {
  if (!image) return undefined;

  const entries = new Map<string, string>();

  for (const { density, key } of SRCSET_VARIANTS[variant]) {
    const candidate = image[key];
    if (candidate) entries.set(density, candidate);
  }

  if (!entries.has("1x")) entries.set("1x", fallbackSrc);

  const uniqueEntries = Array.from(entries.entries()).filter(
    ([density, src], index, allEntries) => {
      return allEntries.findIndex(([, entrySrc]) => entrySrc === src) === index || density === "1x";
    }
  );

  if (uniqueEntries.length <= 1) return undefined;

  return uniqueEntries.map(([density, src]) => `${src} ${density}`).join(", ");
}

export function StorefrontImage({
  alt,
  image,
  variant = "standard",
  decoding = "async",
  loading = "lazy",
  ...props
}: StorefrontImageProps) {
  const src = resolveSrc(image, variant);

  if (!src) return null;

  return (
    <img
      {...props}
      src={src}
      srcSet={buildSrcSet(image, variant, src)}
      alt={alt}
      decoding={decoding}
      loading={loading}
    />
  );
}
