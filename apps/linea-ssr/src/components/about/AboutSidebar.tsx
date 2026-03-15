import { AboutSidebar as SharedAboutSidebar } from "@ce/linea-shared/about";
import { useLocation } from "@tanstack/react-router";
import { LineaLink } from "@/lib/linea-routing";

const AboutSidebar = () => {
  const location = useLocation();
  return <SharedAboutSidebar currentPath={location.pathname} LinkComponent={LineaLink} />;
};

export default AboutSidebar;
