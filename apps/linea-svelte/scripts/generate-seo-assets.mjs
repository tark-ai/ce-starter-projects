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

// The frameworks read .env first and let .env.local override it. Both are
// honoured here for the same reason: `create-commercengine` writes .env, a
// hand-configured checkout usually uses .env.local, and reading only one of
// them reports the credentials missing while they sit in the other. CI and
// Vercel have no file at all and inject the process environment instead.
function readEnvFile(name) {
  const path = new URL(`../${name}`, import.meta.url);
  if (!existsSync(path)) return {};
  return Object.fromEntries(
    readFileSync(path, "utf8")
      .split("\n")
      .filter((line) => line.includes("=") && !line.trimStart().startsWith("#"))
      .map((line) => {
        const i = line.indexOf("=");
        // Values may be quoted; a literal quote in the store id produces a 404 that looks
        // like a credentials problem rather than a parsing one.
        return [line.slice(0, i).trim(), line.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
      }),
  );
}

const fileEnv = { ...readEnvFile(".env"), ...readEnvFile(".env.local") };
const env = { ...process.env, ...fileEnv };

// Without credentials the catalog calls fail and this would emit an empty sitemap that looks
// valid — fail the build with the missing names instead.
if (!env.PUBLIC_STORE_ID || !env.PUBLIC_API_KEY) {
  throw new Error(
    "[seo] missing PUBLIC_STORE_ID / PUBLIC_API_KEY. Set them in .env or .env.local for a local build, " +
      "or in the deployment's environment variables.",
  );
}

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
