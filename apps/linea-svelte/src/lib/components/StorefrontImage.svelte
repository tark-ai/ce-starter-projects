<script lang="ts">
type StorefrontImageSource = {
  url_tiny?: string | null;
  url_thumbnail?: string | null;
  url_standard?: string | null;
  url_zoom?: string | null;
};

type StorefrontImageVariant = "tiny" | "thumbnail" | "standard" | "zoom";

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

  const entries: Array<{ density: string; src: string }> = [];

  for (const { density, key } of SRCSET_VARIANTS[variant]) {
    const candidate = image[key];
    if (candidate && !entries.some((e) => e.density === density)) {
      entries.push({ density, src: candidate });
    }
  }

  if (!entries.some((e) => e.density === "1x")) {
    entries.unshift({ density: "1x", src: fallbackSrc });
  }

  const uniqueEntries = entries.filter(
    ({ src }, index, all) => all.findIndex((e) => e.src === src) === index
  );

  if (uniqueEntries.length <= 1) return undefined;

  return uniqueEntries.map(({ density, src }) => `${src} ${density}`).join(", ");
}

interface Props {
  image: StorefrontImageSource | null | undefined;
  alt: string;
  variant?: StorefrontImageVariant;
  sizes?: string;
  class?: string;
  [key: string]: unknown;
}

let { image, alt, variant = "standard", sizes, class: className = "", ...rest }: Props = $props();

let src = $derived(resolveSrc(image, variant));
let srcset = $derived(src ? buildSrcSet(image, variant, src) : undefined);
</script>

{#if src}
	<img {src} {srcset} {sizes} {alt} decoding="async" loading="lazy" class={className} {...rest} />
{/if}
