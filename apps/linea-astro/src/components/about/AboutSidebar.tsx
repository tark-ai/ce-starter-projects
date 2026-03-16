import { AboutSidebar as SharedAboutSidebar } from "@ce/linea-shared/about";
import { useEffect, useState } from "react";
import { LineaLink } from "@/lib/linea-routing";

const AboutSidebar = () => {
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  return <SharedAboutSidebar currentPath={pathname} LinkComponent={LineaLink} />;
};

export default AboutSidebar;
