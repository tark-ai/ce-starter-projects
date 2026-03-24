<script lang="ts">
type StorefrontImageSource = {
  url_tiny?: string | null;
  url_thumbnail?: string | null;
  url_standard?: string | null;
  url_zoom?: string | null;
};

type StorefrontImageVariant = "tiny" | "thumbnail" | "standard" | "zoom";

const SRC_FALLBACKS: Record<StorefrontImageVariant, Array<keyof StorefrontImageSource>> = {
  tiny: ["url_thumbnail", "url_standard", "url_zoom"],
  thumbnail: ["url_thumbnail", "url_standard", "url_zoom"],
  standard: ["url_standard", "url_zoom", "url_thumbnail"],
  zoom: ["url_zoom", "url_standard", "url_thumbnail"],
};

/**
 * Cloudflare variant widths:
 *   thumbnail: 256, tiny: 512, standard: 1366, original: 1920
 *
 * The CE SDK doesn't expose a field for the Cloudflare "tiny" variant,
 * so we derive its URL by replacing the variant segment in an existing URL.
 */
const CF_VARIANT_REGEX = /\/(blur|thumbnail|standard|original)\?/;

function deriveTinyUrl(image: StorefrontImageSource): string | null {
  const base = image.url_thumbnail ?? image.url_standard ?? image.url_zoom;
  if (!base) return null;
  return base.replace(CF_VARIANT_REGEX, "/tiny?");
}

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

function buildSrcSet(image: StorefrontImageSource | null | undefined): string | undefined {
  if (!image) return undefined;

  const entries: Array<{ w: number; src: string }> = [];
  const seen = new Set<string>();

  function add(url: string | null | undefined, w: number) {
    if (url && !seen.has(url)) {
      seen.add(url);
      entries.push({ w, src: url });
    }
  }

  add(image.url_thumbnail, 256);
  add(deriveTinyUrl(image), 512);
  add(image.url_standard, 1366);
  add(image.url_zoom, 1920);

  if (entries.length < 2) return undefined;

  entries.sort((a, b) => a.w - b.w);
  return entries.map(({ w, src }) => `${src} ${w}w`).join(", ");
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

const src = $derived(resolveSrc(image, variant));
const srcset = $derived(buildSrcSet(image));
</script>

{#if src}
	<img {src} {srcset} {sizes} {alt} decoding="async" loading="lazy" class={className} {...rest} />
{/if}
