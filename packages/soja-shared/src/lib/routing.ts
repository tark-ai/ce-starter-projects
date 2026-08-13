import type * as React from "react";

export interface SojaRoute {
  path: string;
  search?: Record<string, string | undefined>;
}

export interface SojaLinkProps {
  route: SojaRoute;
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export type SojaLinkComponent = React.ForwardRefExoticComponent<
  SojaLinkProps & React.RefAttributes<HTMLAnchorElement>
>;

export function routeToHref(route: SojaRoute): string {
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
