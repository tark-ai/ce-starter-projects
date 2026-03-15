import { type LineaLinkProps, routeToHref } from "@ce/linea-shared/lib/routing";
import { forwardRef } from "react";
import { Link } from "react-router-dom";

export const LineaLink = forwardRef<HTMLAnchorElement, LineaLinkProps>(
  ({ route, ...props }, ref) => {
    return <Link ref={ref} to={routeToHref(route)} {...props} />;
  }
);

LineaLink.displayName = "LineaLink";
