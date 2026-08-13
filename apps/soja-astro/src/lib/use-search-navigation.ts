import { routeToHref } from "@ce/soja-shared/lib/routing";

export function useSearchNavigation() {
  return (query: string) => {
    if (typeof window === "undefined") return;
    const href = routeToHref({ path: "/search", search: { q: query } });

    // Prefer the client router so /search swaps in via a view transition; fall
    // back to a hard navigation where it isn't available.
    import("astro:transitions/client")
      .then(({ navigate }) => navigate(href))
      .catch(() => {
        window.location.href = href;
      });
  };
}
