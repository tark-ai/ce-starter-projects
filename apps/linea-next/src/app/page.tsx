/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: used to set JSON-LD data during build time */
import { storefront } from "@/lib/storefront";
import { HomeContent } from "./home-content";

const SITE_URL = "https://linea.demo.commercengine.com";
const SITE_NAME = "Linea";

export const revalidate = 3600;

export default async function Home() {
  const sdk = storefront.publicStorefront();
  const { data } = await sdk.catalog.listSkus({ page: 1, limit: 6 });

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.svg`,
    },
  ];

  return (
    <>
      {jsonLd.map((schema) => (
        <script
          key={schema["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <HomeContent initialProducts={data?.skus ?? []} />
    </>
  );
}
