/**
 * Credential resolution shared by this app's build scripts.
 *
 * Duplicated per app rather than shared from the repo root on purpose:
 * `create-commercengine` downloads a single app directory, and a module one
 * level up would not travel with it.
 */
import { existsSync, readFileSync } from "node:fs";
import { parseEnv } from "node:util";

/**
 * Node's own dotenv parser, which handles inline comments, quoting and an
 * `export` prefix exactly as the framework loaders do.
 *
 * This is not a style preference. Trimming the raw suffix by hand read
 * `KEY= # provision in CI` as the non-empty value "# provision in CI", so the
 * guard passed and the build received no key at all — the silent empty
 * storefront this check exists to prevent.
 */
function parse(text) {
  if (typeof parseEnv === "function") return parseEnv(text);
  // Node < 20.12. Narrower, but wrong in the same direction as the parser it
  // replaces would be: an unparsed value reads as absent, never as present.
  const out = {};
  for (const raw of text.split("\n")) {
    const line = raw.trim().replace(/^export\s+/, "");
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const i = line.indexOf("=");
    const key = line.slice(0, i).trim();
    let value = line.slice(i + 1).trim();
    const quote = value[0];
    if (quote === '"' || quote === "'") {
      const end = value.indexOf(quote, 1);
      value = end === -1 ? value.slice(1) : value.slice(1, end);
    } else {
      // Anchored too: a value that is only a comment must read as empty,
      // which is precisely the case the hand parser used to get wrong.
      value = value.split(/(?:^|\s)#/)[0].trim();
    }
    out[key] = value;
  }
  return out;
}

function readEnvFile(name) {
  const path = new URL(`../${name}`, import.meta.url);
  return existsSync(path) ? parse(readFileSync(path, "utf8")) : {};
}

/**
 * The files a build resolves, lowest precedence first.
 *
 * Next ranks .env.local ABOVE the mode file. Vite ranks it below, so the
 * Vite-based starters deliberately order these differently — it is not an
 * inconsistency to tidy up.
 */
export function envFilesFor(mode) {
  return [".env", `.env.${mode}`, ".env.local", `.env.${mode}.local`];
}

/**
 * Every file for the mode, then the process environment.
 *
 * Exported variables outrank every file: CI and Vercel supply the real
 * credentials that way, and a scaffolded .env left on disk would otherwise
 * point a build step at a different store than the build itself compiles
 * against.
 */
export function loadEnv(mode = "production") {
  let env = {};
  for (const file of envFilesFor(mode)) env = { ...env, ...readEnvFile(file) };
  return { ...env, ...process.env };
}

/**
 * Fails the build when credentials are absent.
 *
 * Without them the catalog calls return nothing and the build still succeeds,
 * so the deploy is a storefront with no products behind a green build. That is
 * the worst failure shape available — nothing to notice until a customer does.
 */
export function requireCredentials(env, mode = "production", tag = "commerce") {
  const missing = ["NEXT_PUBLIC_STORE_ID", "NEXT_PUBLIC_API_KEY"].filter((name) => !env[name]);
  if (missing.length === 0) return;
  throw new Error(
    `[${tag}] missing ${missing.join(" / ")}. Set them in ` +
      `${envFilesFor(mode).join(", ")}, or in the deployment's environment variables.`
  );
}
