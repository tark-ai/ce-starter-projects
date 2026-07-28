// Escape a dynamic value for interpolation inside a single-quoted
// Meilisearch filter literal, e.g. `Men's` → `Men\'s`. Without this, an
// apostrophe or backslash produces an invalid (or injectable) filter.
function escapeFilterValue(value: unknown): string {
  return String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

export function buildFilter(
  userFilters: Record<string, unknown>,
  categoryName?: string
): (string | string[])[] {
  const conditions: (string | string[])[] = [];

  if (categoryName) {
    conditions.push(`categories.name = '${escapeFilterValue(categoryName)}'`);
  }

  const priceRange = userFilters.price_range as { min: number; max: number } | undefined;
  if (priceRange) {
    conditions.push(`pricing.selling_price ${priceRange.min} TO ${priceRange.max}`);
  }

  for (const [key, values] of Object.entries(userFilters)) {
    if (key === "price_range") continue;
    if (!Array.isArray(values) || values.length === 0) continue;

    if (values.length === 1) {
      conditions.push(`${key} = '${escapeFilterValue(values[0])}'`);
    } else {
      // Multiple values for the same attribute → OR
      conditions.push(values.map((v: string) => `${key} = '${escapeFilterValue(v)}'`));
    }
  }

  return conditions;
}
