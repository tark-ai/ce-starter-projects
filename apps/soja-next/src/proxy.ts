import { createNextjsSeoProxy } from "@commercengine/seo/nextjs/server";
import { seo } from "@/lib/seo";

/**
 * Every SEO surface from one place: `.md` mirrors, `Accept: text/markdown` negotiation,
 * robots.txt, and the XML sitemap plus its shards.
 */
export default createNextjsSeoProxy(seo, { robots: true, sitemap: true });

export const config = {
  matcher: [
    "/product/:path*",
    "/category/:path*",
    "/search",
    "/search.md",
    "/llms.txt",
    "/sitemap.md",
    "/robots.txt",
    "/sitemap.xml",
    "/sitemap/:path*",
  ],
};
