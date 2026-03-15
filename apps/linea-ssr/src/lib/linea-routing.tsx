import type { LineaLinkProps } from "@ce/linea-shared/lib/routing";
import { Link } from "@tanstack/react-router";
import { forwardRef } from "react";

export const LineaLink = forwardRef<HTMLAnchorElement, LineaLinkProps>(
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

LineaLink.displayName = "LineaLink";
