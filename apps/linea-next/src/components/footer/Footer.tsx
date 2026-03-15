"use client";

import { Footer as SharedFooter } from "@ce/linea-shared/footer";
import { LineaLink } from "@/lib/linea-routing";

const Footer = () => {
  return <SharedFooter LinkComponent={LineaLink} />;
};

export default Footer;
