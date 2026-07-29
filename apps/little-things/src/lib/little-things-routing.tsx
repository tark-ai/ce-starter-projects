import { type LittleThingsLinkProps, routeToHref } from "@ce/little-things-shared/lib/routing";
import { forwardRef } from "react";
import { Link } from "react-router-dom";

export const LittleThingsLink = forwardRef<HTMLAnchorElement, LittleThingsLinkProps>(
  ({ route, ...props }, ref) => {
    return <Link ref={ref} to={routeToHref(route)} {...props} />;
  }
);

LittleThingsLink.displayName = "LittleThingsLink";
