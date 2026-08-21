import { createTanStackStartSeoMiddleware } from "@commercengine/seo/tanstack-start/server";
import { createStart } from "@tanstack/react-start";
import { seo } from "@/lib/seo";

/**
 * Serves `.md` mirrors and negotiates `Accept: text/markdown` ahead of route matching.
 *
 * A request middleware rather than file routes: TanStack params must be valid JavaScript
 * identifiers, so a `/product/$slug.md` route is rejected — the middleware intercepts the
 * suffix before the router ever sees it.
 */
const seoMiddleware = createTanStackStartSeoMiddleware(seo, { robots: true, sitemap: true });

export const startInstance = createStart(() => ({
  requestMiddleware: [seoMiddleware],
}));
