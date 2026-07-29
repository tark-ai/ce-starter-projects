/**
 * Serialize a value to JSON for embedding inside an inline
 * `<script type="application/ld+json">` block (via React's
 * `dangerouslySetInnerHTML`, Astro's `set:html`, or Svelte's `{@html}`).
 *
 * Catalog data (product/category names, descriptions) is untrusted and may
 * contain sequences like `</script>` that would otherwise break out of the
 * script element and enable markup/script injection. `JSON.stringify` does NOT
 * escape these, so we escape the HTML-significant characters `<`, `>` and `&`
 * to their unicode escapes. The result is still valid JSON / JSON-LD.
 *
 * This is the single, shared implementation for every Little Things storefront
 * so the escaping behaviour can't drift between apps.
 */
const ESCAPE_MAP: Record<string, string> = {
  "<": "\\u003c",
  ">": "\\u003e",
  "&": "\\u0026",
};

export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/[<>&]/g, (char) => ESCAPE_MAP[char] ?? char);
}
