import type { Product, ProductAttribute } from "@commercengine/storefront";

// getProductDetail returns `Product & AdditionalProductDetails`; the long-form
// `description` lives on the latter.
export type SojaProductDetail = Product & { description?: string | null };

export interface AttributeSwatch {
  name: string;
  hexcode: string;
}

export interface AttributeSpec {
  key: string;
  name: string;
  value: string;
  swatches: AttributeSwatch[];
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  // Date-only values parse as UTC; formatting in local time would shift the day
  // west of UTC and diverge between SSR and hydration.
  timeZone: "UTC",
});

export function formatAttributeValue(attribute: ProductAttribute): string {
  switch (attribute.type) {
    case "color":
      return attribute.value.map((color) => color.name).join(", ");
    case "multi-select":
      return attribute.value.join(", ");
    case "boolean":
      return attribute.value ? "Yes" : "No";
    case "number":
      return String(attribute.value);
    case "date": {
      const parsed = new Date(attribute.value);
      return Number.isNaN(parsed.getTime()) ? attribute.value : dateFormatter.format(parsed);
    }
    default:
      return attribute.value.trim();
  }
}

export function getAttributes(
  attributes: ProductAttribute[] | null | undefined
): ProductAttribute[] {
  return attributes ?? [];
}

export function findAttribute(
  attributes: ProductAttribute[] | null | undefined,
  keys: string[]
): ProductAttribute | null {
  const wanted = new Set(keys.map((key) => key.toLowerCase()));
  return (
    getAttributes(attributes).find((attribute) => wanted.has(attribute.key.toLowerCase())) ?? null
  );
}

export function readAttributeText(
  attributes: ProductAttribute[] | null | undefined,
  keys: string[]
): string | null {
  const attribute = findAttribute(attributes, keys);
  return (attribute && formatAttributeValue(attribute)) || null;
}

export function toAttributeSpecs(
  attributes: ProductAttribute[] | null | undefined,
  excludeKeys: string[] = []
): AttributeSpec[] {
  const excluded = new Set(excludeKeys.map((key) => key.toLowerCase()));

  return getAttributes(attributes)
    .filter((attribute) => !excluded.has(attribute.key.toLowerCase()))
    .map((attribute) => ({
      key: attribute.key,
      name: attribute.name || attribute.key,
      value: formatAttributeValue(attribute),
      swatches: attribute.type === "color" ? attribute.value.map((color) => ({ ...color })) : [],
    }))
    .filter((spec) => spec.value.length > 0);
}

export function getProductTags(tags: string[] | null | undefined, limit?: number): string[] {
  const unique = new Set<string>();
  for (const tag of tags ?? []) {
    const trimmed = tag.trim();
    if (trimmed) unique.add(trimmed);
  }

  const tagList = [...unique];
  return typeof limit === "number" ? tagList.slice(0, limit) : tagList;
}

export function splitDescription(description?: string | null): { lede: string; rest: string } {
  const text = (description ?? "").trim();
  if (!text) return { lede: "", rest: "" };

  const paragraphs = text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length <= 1) return { lede: paragraphs[0] ?? "", rest: "" };
  return { lede: paragraphs[0] ?? "", rest: paragraphs.slice(1).join("\n\n") };
}
