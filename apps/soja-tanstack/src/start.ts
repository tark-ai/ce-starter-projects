import { createTanStackStartSeoMiddleware } from "@commercengine/seo/tanstack-start/server";
import { createStart } from "@tanstack/react-start";
import { seo } from "@/lib/seo";

/**
 * Every SEO surface from one middleware: `.md` mirrors, `Accept: text/markdown` negotiation,
 * robots.txt and the XML sitemap. Markdown mirrors *require* this — TanStack route params must
 * be valid JavaScript identifiers, so a `$slug.md` file route is rejected outright.
 */
export const startInstance = createStart(() => ({
  requestMiddleware: [createTanStackStartSeoMiddleware(seo, { robots: true, sitemap: true })],
}));
