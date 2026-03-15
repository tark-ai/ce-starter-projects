"use client";

import { AboutSidebar as SharedAboutSidebar } from "@ce/linea-shared/about";
import { usePathname } from "next/navigation";
import { LineaLink } from "@/lib/linea-routing";

const AboutSidebar = () => {
  const pathname = usePathname();
  return <SharedAboutSidebar currentPath={pathname} LinkComponent={LineaLink} />;
};

export default AboutSidebar;
