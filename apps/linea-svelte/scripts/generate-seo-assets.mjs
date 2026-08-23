/**
 * Emits every SEO asset into `static/` before the build.
 *
 * adapter-static has no server, so nothing can generate these on request. Routes could emit
 * them at prerender time, but SvelteKit gives `/product/[slug]` priority over any catch-all,
 * so `/product/apex.md` would be claimed by the page route. Writing plain files sidesteps
 * routing altogether.
 */
import { existsSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createCommerceSeo } from "@commercengine/seo";
import { createCommerceSeoStaticAssets } from "@commercengine/seo/static";
import { createStorefront, Environment } from "@commercengine/storefront";
import { loadEnv, requireCredentials } from "./env.mjs";

// Resolution and the credential guard live in env.mjs so this script and
// check-env.mjs cannot drift apart on which files count or how they parse.
const env = loadEnv("production");
requireCredentials(env, "production", "seo");

const SITE_URL = "https://linea-svelte.demo.commercengine.com";

const seo = createCommerceSeo({
  storefront: createStorefront({
    storeId: env.PUBLIC_STORE_ID,
    apiKey: env.PUBLIC_API_KEY,
    environment: env.PUBLIC_CE_ENV === "production" ? Environment.Production : Environment.Staging,
  }),
  site: {
    name: "LINEA",
    url: SITE_URL,
    brandName: "LINEA",
    description: "Timeless fine jewelry, crafted to be worn every day.",
    locale: "en_US",
  },
  routes: { productBase: "/product", categoryBase: "/category" },
  indexable: true,
});

const assets = await createCommerceSeoStaticAssets(seo);
const staticDir = new URL("../static/", import.meta.url).pathname;

for (const asset of assets) {
  const target = join(staticDir, asset.pathname.replace(/^\//, ""));
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, asset.body);
}

console.log(`[seo] wrote ${assets.length} assets into static/`);
