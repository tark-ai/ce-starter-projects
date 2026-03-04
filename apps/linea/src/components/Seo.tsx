import { useEffect } from "react";

export const SITE_URL = "https://linea.demo.commercengine.com";
export const SITE_NAME = "Linea";
const TWITTER_SITE = "@commerceengine";
const DEFAULT_DESCRIPTION =
  "Shop Linea's curated collection of minimalist jewelry — rings, necklaces, earrings, and bracelets crafted for the modern individual. Free shipping on all orders.";

interface SEOProps {
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
    : `${SITE_NAME} - Minimalist jewelry crafted for the modern individual`;
  const ogImageUrl = ogImage ?? `${SITE_URL}/og-image.jpg`;

  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

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

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      {noindex && <meta name="robots" content="noindex, follow" />}

      {/* Open Graph */}
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
