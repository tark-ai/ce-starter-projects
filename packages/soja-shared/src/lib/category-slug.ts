import type { Category } from "@commercengine/storefront";

/**
 * A category URL may carry a slug, a raw id, or a name-derived slug. They are tried
 * in that order of authority: one category's derived name can collide with another's
 * canonical slug, and a single pass would let whichever came first in the list win.
 */
export function matchCategory(
  categories: Category[],
  slug: string | undefined
): Category | undefined {
  if (!slug) return undefined;
  return (
    categories.find((entry) => entry.slug === slug) ??
    categories.find((entry) => entry.id === slug) ??
    categories.find((entry) => entry.name.toLowerCase().replace(/\s+/g, "-") === slug)
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
