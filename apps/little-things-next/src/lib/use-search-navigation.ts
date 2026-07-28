"use client";

import { routeToHref } from "@ce/little-things-shared/lib/routing";
import { useRouter } from "next/navigation";

export function useSearchNavigation() {
  const router = useRouter();

  return (query: string) => {
    router.push(routeToHref({ path: "/search", search: { q: query } }));
  };
}
