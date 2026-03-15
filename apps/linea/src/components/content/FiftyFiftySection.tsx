import { FiftyFiftySection as SharedFiftyFiftySection } from "@ce/linea-shared/content";
import { LineaLink } from "@/lib/linea-routing";

const FiftyFiftySection = () => {
  return <SharedFiftyFiftySection LinkComponent={LineaLink} />;
};

export default FiftyFiftySection;
