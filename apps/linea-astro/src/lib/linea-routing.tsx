import { type LineaLinkProps, routeToHref } from "@ce/linea-shared/lib/routing";
import { forwardRef } from "react";

export const LineaLink = forwardRef<HTMLAnchorElement, LineaLinkProps>(
  ({ route, ...props }, ref) => {
    return <a ref={ref} href={routeToHref(route)} {...props} />;
  }
);

LineaLink.displayName = "LineaLink";
