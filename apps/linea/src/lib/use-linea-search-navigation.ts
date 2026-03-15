import { routeToHref } from "@ce/linea-shared/lib/routing";
import { useNavigate } from "react-router-dom";

export function useLineaSearchNavigation() {
  const navigate = useNavigate();

  return (query: string) => {
    navigate(routeToHref({ path: "/search", search: { q: query } }));
  };
}
