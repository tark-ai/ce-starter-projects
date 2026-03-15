"use client";

import { type LineaLinkProps, routeToHref } from "@ce/linea-shared/lib/routing";
import Link from "next/link";
import { forwardRef } from "react";

export const LineaLink = forwardRef<HTMLAnchorElement, LineaLinkProps>(
  ({ route, ...props }, ref) => {
    return <Link ref={ref} href={routeToHref(route)} {...props} />;
  }
);

LineaLink.displayName = "LineaLink";
