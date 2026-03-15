import { useNavigate } from "@tanstack/react-router";

export function useLineaSearchNavigation() {
  const navigate = useNavigate();

  return (query: string) => {
    navigate({
      to: "/search" as never,
      search: { q: query } as never,
    });
  };
}
