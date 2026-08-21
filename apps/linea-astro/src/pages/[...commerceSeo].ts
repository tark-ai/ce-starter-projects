import { createAstroSeoStaticEndpoint } from "@commercengine/seo/astro/static";
import { seo } from "../lib/seo";

/**
 * Emits every SEO asset at build time from one route: robots.txt, sitemap.xml (sharded when
 * needed), llms.txt, sitemap.md, and a `.md` mirror for each product and category.
 *
 * A rest param, so it only handles paths no other page claims.
 */
export const { getStaticPaths, GET } = createAstroSeoStaticEndpoint(seo);
