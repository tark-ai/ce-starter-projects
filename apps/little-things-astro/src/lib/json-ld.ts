// Serialize an object for injection into an inline <script type="application/ld+json">
// via set:html. Catalog content (names, descriptions) is untrusted and may contain
// "</script>" or other HTML-significant characters. Escaping "<", ">", and "&" as
// unicode escapes keeps the JSON valid while preventing the string from breaking out
// of the script element (markup/script injection).
export function safeJsonLd(obj: unknown): string {
  return JSON.stringify(obj)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
