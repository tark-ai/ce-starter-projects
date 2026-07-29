// Re-exported from the shared design-system package so the JSON-LD escaping
// behaviour is defined once for every Little Things storefront (avoids drift of
// this security-sensitive serializer across apps).
export { safeJsonLd } from "@ce/little-things-ui/lib/json-ld";
