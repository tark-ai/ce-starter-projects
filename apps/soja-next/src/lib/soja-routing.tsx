"use client";

import { routeToHref, type SojaLinkProps } from "@ce/soja-shared/lib/routing";
import Link from "next/link";
import { forwardRef } from "react";

export const SojaLink = forwardRef<HTMLAnchorElement, SojaLinkProps>(({ route, ...props }, ref) => {
  return <Link ref={ref} href={routeToHref(route)} {...props} />;
});

SojaLink.displayName = "SojaLink";
