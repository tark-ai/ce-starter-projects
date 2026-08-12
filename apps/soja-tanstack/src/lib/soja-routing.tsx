import type { SojaLinkProps } from "@ce/soja-shared/lib/routing";
import { Link } from "@tanstack/react-router";
import { forwardRef } from "react";

export const SojaLink = forwardRef<HTMLAnchorElement, SojaLinkProps>(({ route, ...props }, ref) => {
  return (
    <Link
      ref={ref}
      to={route.path as never}
      search={route.search ? (route.search as never) : undefined}
      {...props}
    />
  );
});

SojaLink.displayName = "SojaLink";
