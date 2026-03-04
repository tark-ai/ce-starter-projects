import type { CookieOptions } from "@commercengine/ssr-utils";

export function getClientCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift();
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }
  return null;
}

export function setClientCookie(name: string, value: string, options?: CookieOptions): void {
  const encodedValue = encodeURIComponent(value);
  let cookieString = `${name}=${encodedValue}`;

  const maxAge = options?.maxAge ?? 30 * 24 * 60 * 60;
  cookieString += `; Max-Age=${maxAge}`;
  cookieString += `; Path=${options?.path ?? "/"}`;

  if (options?.domain) {
    cookieString += `; Domain=${options.domain}`;
  }

  const secure = options?.secure ?? window.location?.protocol === "https:";
  if (secure) {
    cookieString += "; Secure";
  }

  const sameSiteMap: Record<string, string> = {
    strict: "Strict",
    lax: "Lax",
    none: "None",
  };
  const sameSite = options?.sameSite ? sameSiteMap[options.sameSite] : "Lax";
  cookieString += `; SameSite=${sameSite}`;

  // biome-ignore lint: Required for cookie-based token storage
  document.cookie = cookieString;
}

export function deleteClientCookie(name: string): void {
  // biome-ignore lint: Required for cookie-based token storage
  document.cookie = `${name}=; Max-Age=0; Path=/`;
}
