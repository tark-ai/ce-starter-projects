"use client";

import { type LittleThingsLinkProps, routeToHref } from "@ce/little-things-shared/lib/routing";
import Link from "next/link";
import { forwardRef } from "react";

export const LittleThingsLink = forwardRef<HTMLAnchorElement, LittleThingsLinkProps>(
  ({ route, ...props }, ref) => {
    return <Link ref={ref} href={routeToHref(route)} {...props} />;
  }
);

LittleThingsLink.displayName = "LittleThingsLink";
