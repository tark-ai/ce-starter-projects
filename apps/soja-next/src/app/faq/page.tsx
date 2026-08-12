/** biome-ignore-all lint/style/useComponentExportOnlyModules: Next.js page conventions */

import type { Metadata } from "next";
import FaqAccordion from "@/components/faq/FaqAccordion";
import { OG_IMAGES, SITE_NAME, SITE_URL } from "@/lib/constants";
import { FAQ_ITEMS } from "@/lib/site-content";

const SUBTITLE =
  "Everything about shipping, shelf life and using our formulations. If your question isn't here, write to us.";

export const metadata: Metadata = {
  title: "FAQs",
  description: `Frequently asked questions about ${SITE_NAME} — shipping, shelf life, sensitivities and use.`,
  openGraph: {
    title: `FAQs | ${SITE_NAME}`,
    description: SUBTITLE,
    type: "website",
    url: `${SITE_URL}/faq`,
    images: OG_IMAGES,
  },
};

export default function FaqPage() {
  return (
    <main>
      <FaqAccordion items={FAQ_ITEMS} title="FAQs" subtitle={SUBTITLE} />
    </main>
  );
}
