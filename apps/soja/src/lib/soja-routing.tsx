import { routeToHref, type SojaLinkProps } from "@ce/soja-shared/lib/routing";
import { forwardRef } from "react";
import { Link } from "react-router-dom";

export const SojaLink = forwardRef<HTMLAnchorElement, SojaLinkProps>(({ route, ...props }, ref) => {
  return <Link ref={ref} to={routeToHref(route)} {...props} />;
});

SojaLink.displayName = "SojaLink";
