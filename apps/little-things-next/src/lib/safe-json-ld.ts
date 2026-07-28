/**
 * Serialize an object to JSON for embedding inside a <script> tag via
 * dangerouslySetInnerHTML. Escapes the characters that could otherwise let
 * untrusted catalog data (names, descriptions) break out of the script
 * context, e.g. a value containing `</script>`.
 */
export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
