function identityFromToken(accessToken: string | null): string | null {
  if (!accessToken) return null;
  try {
    const payload = accessToken.split(".")[1];
    if (!payload) return accessToken;
    let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    base64 += "=".repeat((4 - (base64.length % 4)) % 4);
    const claims = JSON.parse(atob(base64)) as { ulid?: unknown };
    return typeof claims.ulid === "string" ? claims.ulid : accessToken;
  } catch {
    return accessToken;
  }
}

export function createSessionChangeNotifier() {
  const listeners = new Set<() => void>();
  let identity: string | null | undefined;

  return {
    update(accessToken: string | null) {
      const next = identityFromToken(accessToken);
      if (identity === next) return;
      identity = next;
      for (const listener of listeners) {
        try {
          listener();
        } catch {}
      }
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
