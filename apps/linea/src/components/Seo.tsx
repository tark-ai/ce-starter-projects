import type { CommerceSeoHead } from "@commercengine/seo";
import { useEffect } from "react";
import { SITE_NAME, SITE_URL } from "../lib/constants";

export { SITE_NAME, SITE_URL };
export const FRAMEWORK = "React";
const TWITTER_SITE = "@commerceengine";
const DEFAULT_DESCRIPTION =
  "LINEA is a production-ready e-commerce starter template built with Commerce Engine and React. A reference implementation featuring a minimalist jewelry storefront with full catalog, cart, checkout, and search.";

interface SEOProps {
  /**
   * Head data from @commercengine/seo. When present it supersedes the props below, so a page
   * that has it does not also hand-build a title, canonical, Open Graph block or JSON-LD.
   */
  head?: CommerceSeoHead | null;
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Renders SEO meta tags and injects JSON-LD scripts into <head>.
 * Uses React 19 built-in metadata hoisting for title/meta/link tags.
 */
const SEO = ({
  head,
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  ogImage,
  ogType = "website",
  noindex = false,
  jsonLd,
}: SEOProps) => {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} — Commerce Engine + ${FRAMEWORK} Starter Template`;
  const ogImageUrl = ogImage ?? `${SITE_URL}/og-image.jpg`;

  const schemas = head
    ? head.scripts.map((script) => JSON.parse(script.content) as Record<string, unknown>)
    : jsonLd
      ? Array.isArray(jsonLd)
        ? jsonLd
        : [jsonLd]
      : [];

  useEffect(() => {
    if (schemas.length === 0) return;

    const scripts = schemas.map((schema) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo-jsonld", "true");
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
      return script;
    });

    return () => {
      for (const script of scripts) {
        script.remove();
      }
    };
  }, [schemas]);

  // React 19 hoists these into <head>. When the package supplied head data it is rendered
  // verbatim, so canonical, Open Graph and Twitter tags all come from one source.
  if (head) {
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
        <meta name="twitter:site" content={TWITTER_SITE} />
      </>
    );
  }

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      {noindex && <meta name="robots" content="noindex, follow" />}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {canonical && <meta property="og:url" content={canonical} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_SITE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
    </>
  );
};

export default SEO;
