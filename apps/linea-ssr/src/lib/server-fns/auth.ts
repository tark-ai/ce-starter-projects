import { createServerFn } from "@tanstack/react-start";
import { ensureAuth } from "@/lib/storefront";

export const ensureServerAuth = createServerFn({ method: "POST" }).handler(async () => {
  await ensureAuth();
  return { ok: true };
});
