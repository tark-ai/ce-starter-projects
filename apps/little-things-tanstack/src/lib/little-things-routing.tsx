import type { LittleThingsLinkProps } from "@ce/little-things-shared/lib/routing";
import { Link } from "@tanstack/react-router";
import { forwardRef } from "react";

export const LittleThingsLink = forwardRef<HTMLAnchorElement, LittleThingsLinkProps>(
  ({ route, ...props }, ref) => {
    return (
      <Link
        ref={ref}
        to={route.path as never}
        search={route.search ? (route.search as never) : undefined}
        {...props}
      />
    );
  }
);

LittleThingsLink.displayName = "LittleThingsLink";
