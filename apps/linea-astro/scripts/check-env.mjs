/**
 * Fails the build when Commerce Engine credentials are absent.
 *
 * Without them every catalog call comes back empty and the build still
 * succeeds: `generateStaticParams` catches the failure and returns an empty
 * list, so the deploy is a storefront with no products behind a green build.
 * That is the worst failure shape available — nothing to notice until a
 * customer does. Fail here, naming the variables that are missing.
 *
 * The other starters do this inside generate-seo-assets.mjs. This app renders
 * its SEO assets in-framework and has no such step, so the check stands alone.
 * It is duplicated per app rather than shared from the repo root on purpose:
 * `create-commercengine` downloads a single app directory, and a script one
 * level up would not come with it.
 */
import { existsSync, readFileSync } from "node:fs";

/** Parses a dotenv file, tolerating comments, blanks and quoted values. */
function readEnvFile(name) {
  const path = new URL(`../${name}`, import.meta.url);
  if (!existsSync(path)) return {};
  return Object.fromEntries(
    readFileSync(path, "utf8")
      .split("\n")
      .filter((line) => line.includes("=") && !line.trimStart().startsWith("#"))
      .map((line) => {
        const i = line.indexOf("=");
        // A literal quote in the store id produces a 404 that reads as a
        // credentials problem rather than a parsing one.
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

// The frameworks read .env first and let .env.local override it. Both are
// honoured here for the same reason: `create-commercengine` writes .env, a
// hand-configured checkout usually uses .env.local, and reading only one of
// them reports the credentials missing while they sit in the other. CI and
// Vercel have no file at all and inject the process environment instead.
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

if (!env.PUBLIC_STORE_ID || !env.PUBLIC_API_KEY) {
  throw new Error(
    "[commerce] missing PUBLIC_STORE_ID / PUBLIC_API_KEY. Set them in .env or .env.local " +
      "for a local build, or in the deployment's environment variables."
  );
}
