import { IMAGEKIT_ENDPOINT } from "@ce/soja-ui/lib/images";

const WIDTHS = [320, 640, 768, 1024, 1280, 1536, 1792] as const;

export function ikUrl(path: string, width: number, quality = 80): string {
  // A missing leading slash would concatenate onto the transformation string.
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${IMAGEKIT_ENDPOINT}/tr:w-${width},q-${quality}${normalizedPath}`;
}

export function ikSrcset(path: string, quality = 80): string {
  return WIDTHS.map((w) => `${ikUrl(path, w, quality)} ${w}w`).join(", ");
}
