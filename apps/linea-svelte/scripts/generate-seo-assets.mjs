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

/** Parses one dotenv file, tolerating comments, blanks and quoted values. */
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
        return [
          line.slice(0, i).trim(),
          line
            .slice(i + 1)
            .trim()
            .replace(/^["']|["']$/g, ""),
        ];
      })
  );
}

// A production build resolves the mode-specific files as well, so a deployment
// configured only through .env.production must not be told its credentials are
// missing. Later entries win. Vite ranks the mode file ABOVE .env.local
// (.env, .env.local, .env.[mode], .env.[mode].local) — the opposite of Next —
// and getting it backwards would let a stale .env.local satisfy this check
// while the build compiled against a different store.
const fileEnv = {
  ...readEnvFile(".env"),
  ...readEnvFile(".env.local"),
  ...readEnvFile(".env.production"),
  ...readEnvFile(".env.production.local"),
};

// Exported variables outrank every file. CI and Vercel supply the real
// credentials that way, and a scaffolded .env left on disk would otherwise
// point this step at a different store than the build itself compiles against.
const env = { ...fileEnv, ...process.env };

// Without credentials the catalog calls fail and this would emit an empty sitemap that looks
// valid — fail the build with the missing names instead.
if (!env.PUBLIC_STORE_ID || !env.PUBLIC_API_KEY) {
  throw new Error(
    "[seo] missing PUBLIC_STORE_ID / PUBLIC_API_KEY. Set them in .env, .env.local, .env.production or .env.production.local for a local build, " +
      "or in the deployment's environment variables."
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
