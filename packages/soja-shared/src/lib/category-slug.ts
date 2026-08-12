import type { Category } from "@commercengine/storefront";

/** A category URL may carry a slug, a name-derived slug, or a raw id. */
export function matchCategory(
  categories: Category[],
  slug: string | undefined
): Category | undefined {
  if (!slug) return undefined;
  return categories.find(
    (entry) =>
      entry.slug === slug ||
      entry.name.toLowerCase().replace(/\s+/g, "-") === slug ||
      entry.id === slug
  );
}

/** Fallback display name for a category the catalog hasn't resolved yet. */
export function categoryTitleFromSlug(slug: string): string {
  let decoded: string;
  try {
    decoded = decodeURIComponent(slug);
  } catch {
    // A malformed escape sequence would otherwise throw and fail route rendering.
    decoded = slug;
  }
  decoded = decoded.replace(/-/g, " ");
  return decoded.charAt(0).toUpperCase() + decoded.slice(1);
}
