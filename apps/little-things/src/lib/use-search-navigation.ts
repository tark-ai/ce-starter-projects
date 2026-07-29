import { routeToHref } from "@ce/little-things-shared/lib/routing";
import { useNavigate } from "react-router-dom";

export function useSearchNavigation() {
  const navigate = useNavigate();

  return (query: string) => {
    navigate(routeToHref({ path: "/search", search: { q: query } }));
  };
}
