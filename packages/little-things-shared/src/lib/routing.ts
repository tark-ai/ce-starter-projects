import type * as React from "react";

export interface LittleThingsRoute {
  path: string;
  search?: Record<string, string | undefined>;
}

export interface LittleThingsLinkProps {
  route: LittleThingsRoute;
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export type LittleThingsLinkComponent = React.ForwardRefExoticComponent<
  LittleThingsLinkProps & React.RefAttributes<HTMLAnchorElement>
>;

export function routeToHref(route: LittleThingsRoute): string {
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
