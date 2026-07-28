import { routeToHref } from "@ce/little-things-shared/lib/routing";

export function useSearchNavigation() {
  return (query: string) => {
    window.location.href = routeToHref({ path: "/search", search: { q: query } });
  };
}
