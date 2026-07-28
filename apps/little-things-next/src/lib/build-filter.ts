export function buildFilter(
  userFilters: Record<string, unknown>,
  categoryName?: string
): (string | string[])[] {
  const conditions: (string | string[])[] = [];

  if (categoryName) {
    conditions.push(`categories.name = '${categoryName}'`);
  }

  const priceRange = userFilters.price_range as { min: number; max: number } | undefined;
  if (priceRange) {
    conditions.push(`pricing.selling_price ${priceRange.min} TO ${priceRange.max}`);
  }

  for (const [key, values] of Object.entries(userFilters)) {
    if (key === "price_range") continue;
    if (!Array.isArray(values) || values.length === 0) continue;

    if (values.length === 1) {
      conditions.push(`${key} = '${values[0]}'`);
    } else {
      // Multiple values for the same attribute → OR
      conditions.push(values.map((v: string) => `${key} = '${v}'`));
    }
  }

  return conditions;
}
