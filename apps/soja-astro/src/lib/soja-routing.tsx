import { routeToHref, type SojaLinkProps } from "@ce/soja-shared/lib/routing";
import { forwardRef } from "react";

export const SojaLink = forwardRef<HTMLAnchorElement, SojaLinkProps>(({ route, ...props }, ref) => {
  return <a ref={ref} href={routeToHref(route)} {...props} />;
});

SojaLink.displayName = "SojaLink";
