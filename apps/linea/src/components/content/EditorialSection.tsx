import { EditorialSection as SharedEditorialSection } from "@ce/linea-shared/content";
import { LineaLink } from "@/lib/linea-routing";

const EditorialSection = () => {
  return <SharedEditorialSection LinkComponent={LineaLink} />;
};
export default EditorialSection;
