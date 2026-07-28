/**
 * Serialize an object for safe embedding inside an inline
 * `<script type="application/ld+json">` block.
 *
 * Catalog data (product/category names, descriptions) is untrusted and may
 * contain sequences like `</script>` that would break out of the script tag
 * and enable XSS. JSON.stringify does NOT escape these, so we escape the HTML-
 * sensitive characters `<`, `>` and `&` to their unicode escapes. The result
 * is still valid JSON/JSON-LD.
 */
const ESCAPE_MAP: Record<string, string> = {
  "<": "\\u003c",
  ">": "\\u003e",
  "&": "\\u0026",
};

export function safeJsonLd(obj: unknown): string {
  return JSON.stringify(obj).replace(/[<>&]/g, (char) => ESCAPE_MAP[char] ?? char);
}
