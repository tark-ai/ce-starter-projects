import { Footer as SharedFooter } from "@ce/little-things-shared/footer";
import { LittleThingsLink } from "@/lib/little-things-routing";

const Footer = () => {
  return <SharedFooter LinkComponent={LittleThingsLink} />;
};

export default Footer;
