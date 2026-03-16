import { routeToHref } from "@ce/linea-shared/lib/routing";

export function useLineaSearchNavigation() {
  return (query: string) => {
    window.location.href = routeToHref({ path: "/search", search: { q: query } });
  };
}
