import { Footer as SharedFooter } from "@ce/soja-shared/footer";
import { SojaLink } from "@/lib/soja-routing";

export default function Footer() {
  return <SharedFooter LinkComponent={SojaLink} />;
}
