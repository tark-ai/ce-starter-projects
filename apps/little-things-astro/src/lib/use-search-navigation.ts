import { routeToHref } from "@ce/little-things-shared/lib/routing";

export function useSearchNavigation() {
  return (query: string) => {
    const href = routeToHref({ path: "/search", search: { q: query } });

    // Prefer Astro's client router so the search page swaps in via a view
    // transition instead of a full-page reload. Fall back to a hard navigation
    // if the client router isn't available (e.g. SSR or unsupported browser).
    if (typeof window === "undefined") return;

    import("astro:transitions/client")
      .then(({ navigate }) => {
        navigate(href);
      })
      .catch(() => {
        window.location.href = href;
      });
  };
}
