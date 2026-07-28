import { type LittleThingsLinkProps, routeToHref } from "@ce/little-things-shared/lib/routing";
import { forwardRef } from "react";

export const LittleThingsLink = forwardRef<HTMLAnchorElement, LittleThingsLinkProps>(
  ({ route, ...props }, ref) => {
    return <a ref={ref} href={routeToHref(route)} {...props} />;
  }
);

LittleThingsLink.displayName = "LittleThingsLink";
