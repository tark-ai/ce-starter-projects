/**
 * Fails the build when Commerce Engine credentials are absent.
 *
 * Runs before the framework build, including `build:dev`, which resolves the
 * development-mode env files rather than the production ones — the mode is
 * passed as the first argument so the guard checks the files that build will
 * actually read.
 */
import { loadEnv, requireCredentials } from "./env.mjs";

const mode = process.argv[2] || "production";
requireCredentials(loadEnv(mode), mode);
