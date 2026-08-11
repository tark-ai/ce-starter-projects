const ESCAPE_MAP: Record<string, string> = {
  "<": "\\u003c",
  ">": "\\u003e",
  "&": "\\u0026",
};

/**
 * JSON for an inline `<script type="application/ld+json">` block. Catalog copy
 * is untrusted and `JSON.stringify` does not escape `</script>`, so the
 * HTML-significant characters become unicode escapes — still valid JSON-LD.
 */
export function safeJsonLd(value: unknown): string {
  // Returns `undefined` for a top-level value it can't represent, and .replace
  // on that would throw.
  const json = JSON.stringify(value);
  if (json === undefined) return "null";
  return json.replace(/[<>&]/g, (char) => ESCAPE_MAP[char] ?? char);
}
