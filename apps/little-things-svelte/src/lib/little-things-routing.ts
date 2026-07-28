export interface LittleThingsRoute {
  path: string;
  search?: Record<string, string | undefined>;
}

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
