/**
 * Emits every SEO asset into `public/` before the build.
 *
 * This deployment has no server at request time, so robots.txt, sitemap.xml, llms.txt,
 * sitemap.md and a `.md` mirror per product and category are written as real files. Routes
 * would not work: a framework router gives `/product/[slug]` priority over any catch-all, so
 * `/product/x.md` would be claimed by the page route.
 */
import { existsSync, readFileSync } from "node:fs";
import { createCommerceSeo } from "@commercengine/seo";
import { writeCommerceSeoAssets } from "@commercengine/seo/build";
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
// missing. Later entries win, matching how Next and Vite layer them.
const fileEnv = {
  ...readEnvFile(".env"),
  ...readEnvFile(".env.production"),
  ...readEnvFile(".env.local"),
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
    "[seo] missing PUBLIC_STORE_ID / PUBLIC_API_KEY. Set them in .env or .env.local for a local build, " +
      "or in the deployment's environment variables."
  );
}

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
