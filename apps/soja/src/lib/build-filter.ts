/** Escapes a value for interpolation into a single-quoted Meilisearch literal. */
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
      conditions.push(values.map((v: string) => `${key} = '${escapeFilterValue(v)}'`));
    }
  }

  return conditions;
}
