import type { CookieOptions } from "@commercengine/ssr-utils";
import { getCookie, setCookie } from "@tanstack/react-start/server";

export function getServerCookie(name: string): string | null {
  return getCookie(name) ?? null;
}

export function setServerCookie(name: string, value: string, options?: CookieOptions): void {
  setCookie(name, value, options);
}

export function deleteServerCookie(name: string): void {
  setCookie(name, "", { maxAge: 0, path: "/" });
}
