import { IMAGEKIT_ENDPOINT } from "@ce/ui/lib/images";

const WIDTHS = [320, 640, 768, 1024, 1280, 1536, 1792] as const;

/**
 * Build an ImageKit transformation URL.
 * e.g. https://images.tarkai.com/tr:w-640,q-80/Linea/hero-image.jpg
 */
export function ikUrl(path: string, width: number, quality = 80): string {
  return `${IMAGEKIT_ENDPOINT}/tr:w-${width},q-${quality}${path}`;
}

/**
 * Generate a responsive srcset string using ImageKit transformations.
 * Each entry is a different width rendition of the same image path.
 */
export function ikSrcset(path: string, quality = 80): string {
  return WIDTHS.map((w) => `${ikUrl(path, w, quality)} ${w}w`).join(", ");
}

/**
 * Convenience: returns { src, srcset } for a given image path.
 * `src` is the fallback (largest width), `srcset` has all responsive variants.
 */
export function ikResponsive(path: string, quality = 80) {
  return {
    src: ikUrl(path, 1280, quality),
    srcset: ikSrcset(path, quality),
  };
}
