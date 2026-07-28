import type { AssociatedOption, Product, Variant } from "@commercengine/storefront";

export type AssociatedOptionValue = AssociatedOption[string];

export function optionQueryParamKey(optionKey: string): string {
  return optionKey;
}

export function getVariantOption(
  variant: Variant,
  optionKey: string
): AssociatedOptionValue | null {
  const option = variant.associated_options?.[optionKey];
  if (!option) return null;
  if (option.type === "color" || option.type === "single-select") return option;
  return null;
}

export function getOptionSelectionValue(option: AssociatedOptionValue): string {
  return option.type === "color" ? option.value.name : option.value;
}

export function getVariantOptionSelection(
  variant: Variant,
  optionKeys: string[]
): Record<string, string> {
  const selection: Record<string, string> = {};
  for (const key of optionKeys) {
    const option = getVariantOption(variant, key);
    if (option) {
      selection[key] = getOptionSelectionValue(option);
    }
  }
  return selection;
}

export function hasAllOptionsSelected(
  optionKeys: string[],
  selectedOptions: Record<string, string>
): boolean {
  return optionKeys.length > 0 && optionKeys.every((key) => !!selectedOptions[key]);
}

export function findVariantBySelection(
  variants: Variant[],
  optionKeys: string[],
  selectedOptions: Record<string, string>
): Variant | null {
  if (!hasAllOptionsSelected(optionKeys, selectedOptions)) return null;
  return (
    variants.find((variant) =>
      optionKeys.every((key) => {
        const option = getVariantOption(variant, key);
        return option ? getOptionSelectionValue(option) === selectedOptions[key] : false;
      })
    ) ?? null
  );
}

export function getDefaultVariant(product: Product): Variant | null {
  if (!product.has_variant || product.variants.length === 0) return null;
  const defaultVariant = product.variants.find((variant) => variant.is_default);
  return defaultVariant ?? product.variants[0] ?? null;
}
