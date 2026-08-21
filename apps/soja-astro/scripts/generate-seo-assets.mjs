/**
 * Emits every SEO asset into `public/` before the build.
 *
 * This deployment has no server at request time, so robots.txt, sitemap.xml, llms.txt,
 * sitemap.md and a `.md` mirror per product and category are written as real files. Routes
 * would not work: a framework router gives `/product/[slug]` priority over any catch-all, so
 * `/product/x.md` would be claimed by the page route.
 */
import { readFileSync } from "node:fs";
import { createCommerceSeo } from "@commercengine/seo";
import { writeCommerceSeoAssets } from "@commercengine/seo/build";
import { createStorefront, Environment } from "@commercengine/storefront";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((line) => line.includes("=") && !line.trimStart().startsWith("#"))
    .map((line) => {
      const i = line.indexOf("=");
      // Values may be quoted; a literal quote in the store id produces a 404 that looks like
      // a credentials problem rather than a parsing one.
      return [line.slice(0, i).trim(), line.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
    }),
);

const seo = createCommerceSeo({
  storefront: createStorefront({
    storeId: env.PUBLIC_STORE_ID,
    apiKey: env.PUBLIC_API_KEY,
    environment: env.PUBLIC_CE_ENV === "production" ? Environment.Production : Environment.Staging,
  }),
  site: {
    name: "Soja",
    url: "https://soja-astro.demo.commercengine.io",
    brandName: "Soja",
    description: "Plant-forward essentials for everyday living.",
    locale: "en_US",
  },
  routes: { productBase: "/product", categoryBase: "/category" },
  // A local build is not a production deployment, so detection would mark everything noindex.
  indexable: true,
});

const assets = await writeCommerceSeoAssets(seo, { outDir: "public" });
console.log(`[seo] wrote ${assets.length} assets into public/`);
