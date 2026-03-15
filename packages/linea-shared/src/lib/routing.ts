import type * as React from "react";

export interface LineaRoute {
  path: string;
  search?: Record<string, string | undefined>;
}

export interface LineaLinkProps {
  route: LineaRoute;
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export type LineaLinkComponent = React.ForwardRefExoticComponent<
  LineaLinkProps & React.RefAttributes<HTMLAnchorElement>
>;

export function routeToHref(route: LineaRoute): string {
  if (!route.search) {
    return route.path;
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(route.search)) {
    if (value) {
      params.set(key, value);
    }
  }

  const query = params.toString();
  return query ? `${route.path}?${query}` : route.path;
}
