// Sortable attributes are fixed by the search index: attribute, categories, id,
// pricing, product_id, product_name, product_type, rating, variant_id,
// variant_name. Anything else is a 400 invalid_search_sort.
export const SORT_OPTIONS = [
  { value: "", label: "Featured" },
  { value: "pricing.selling_price:asc", label: "Price, low to high" },
  { value: "pricing.selling_price:desc", label: "Price, high to low" },
  { value: "product_name:asc", label: "Name, A–Z" },
] as const;
