/**
 * Emits every SEO asset into `public/` before the build.
 *
 * This deployment has no server at request time, so robots.txt, sitemap.xml, llms.txt,
 * sitemap.md and a `.md` mirror per product and category are written as real files. Routes
 * would not work: a framework router gives `/product/[slug]` priority over any catch-all, so
 * `/product/x.md` would be claimed by the page route.
 */
import { createCommerceSeo } from "@commercengine/seo";
import { writeCommerceSeoAssets } from "@commercengine/seo/build";
import { createStorefront, Environment } from "@commercengine/storefront";
import { loadEnv, requireCredentials } from "./env.mjs";

// Resolution and the credential guard live in env.mjs so this script and
// check-env.mjs cannot drift apart on which files count or how they parse.
const env = loadEnv("production");
requireCredentials(env, "production", "seo");

const seo = createCommerceSeo({
  storefront: createStorefront({
    storeId: env.PUBLIC_STORE_ID,
    apiKey: env.PUBLIC_API_KEY,
    environment: env.PUBLIC_CE_ENV === "production" ? Environment.Production : Environment.Staging,
  }),
  site: {
    name: "Little Things",
    url: "https://little-things-astro.demo.commercengine.com",
    brandName: "Little Things",
    description: "Small-batch goods, made to last.",
    locale: "en_US",
  },
  routes: { productBase: "/product", categoryBase: "/category" },
  // A local build is not a production deployment, so detection would mark everything noindex.
  indexable: true,
});

const assets = await writeCommerceSeoAssets(seo, { outDir: "public" });
console.log(`[seo] wrote ${assets.length} assets into public/`);
