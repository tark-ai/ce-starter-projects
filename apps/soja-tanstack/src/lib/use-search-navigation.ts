import { useNavigate } from "@tanstack/react-router";

export function useSearchNavigation() {
  const navigate = useNavigate();

  return (query: string) => {
    void navigate({ to: "/search", search: { q: query } });
  };
}
