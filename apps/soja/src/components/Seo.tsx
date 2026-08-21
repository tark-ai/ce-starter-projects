import type { CommerceSeoHead } from "@commercengine/seo";
import { useEffect } from "react";

interface SeoProps {
  /**
   * Head data from @commercengine/seo — title, description, canonical, the Markdown alternate,
   * Open Graph and Twitter tags, and JSON-LD. `null` while it resolves.
   */
  head: CommerceSeoHead | null;
}

/** `property` for Open Graph (RDFa), `name` for everything else. */
function metaKey(tag: { property?: string; name?: string }): string {
  return tag.property ?? tag.name ?? "";
}

/**
 * Retire the sitewide Open Graph and Twitter defaults in `index.html` that this page overrides.
 *
 * React 19 hoists tags into `<head>` but does not deduplicate them against static markup, so
 * without this a product page carries both `og:title` (the site name, from index.html) and
 * `og:title` (the product). Crawlers read the first occurrence, which is the wrong one.
 *
 * Only tags marked `data-seo-default` are touched, and they are restored on unmount so pages
 * without page-level head data keep the defaults after a client-side navigation.
 */
function useRetireDefaults(head: CommerceSeoHead | null) {
  useEffect(() => {
    if (!head) return;

    const supplied = new Set(head.meta.map(metaKey));
    const removed: Array<{ node: Element; parent: Node; next: Node | null }> = [];

    for (const node of document.head.querySelectorAll("meta[data-seo-default]")) {
      const key = node.getAttribute("property") ?? node.getAttribute("name") ?? "";
      // `og:image:width` belongs to the default `og:image`; drop it with its parent tag.
      const overridden =
        supplied.has(key) || [...supplied].some((entry) => key.startsWith(`${entry}:`));
      if (!overridden) continue;
      removed.push({ node, parent: node.parentNode as Node, next: node.nextSibling });
      node.remove();
    }

    return () => {
      for (const { node, parent, next } of removed) parent.insertBefore(node, next);
    };
  }, [head]);
}

/**
 * Renders package-built head data.
 *
 * React 19 hoists `<title>`, `<meta>` and `<link>` into `<head>` from anywhere in the tree, so
 * this can sit inside a page component. Inline `<script>` is not hoisted, so the JSON-LD renders
 * where the component sits — valid, and what Google reads either way.
 */
export function Seo({ head }: SeoProps) {
  useRetireDefaults(head);

  if (!head) return null;

  return (
    <>
      <title>{head.title}</title>
      {head.meta.map((tag) =>
        tag.property ? (
          <meta
            key={`${tag.property}:${tag.content}`}
            property={tag.property}
            content={tag.content}
          />
        ) : (
          <meta key={`${tag.name}:${tag.content}`} name={tag.name} content={tag.content} />
        )
      )}
      {head.links.map((tag) => (
        <link key={`${tag.rel}:${tag.href}`} rel={tag.rel} href={tag.href} type={tag.type} />
      ))}
      {head.scripts.map((script) => (
        <script
          key={script.content.slice(0, 64)}
          type={script.type}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is serialized by the package
          dangerouslySetInnerHTML={{ __html: script.content }}
        />
      ))}
    </>
  );
}

export default Seo;
