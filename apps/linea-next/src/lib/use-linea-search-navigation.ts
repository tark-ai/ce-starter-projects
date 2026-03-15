"use client";

import { routeToHref } from "@ce/linea-shared/lib/routing";
import { useRouter } from "next/navigation";

export function useLineaSearchNavigation() {
  const router = useRouter();

  return (query: string) => {
    router.push(routeToHref({ path: "/search", search: { q: query } }));
  };
}
