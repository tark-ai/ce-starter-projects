import { FaqAccordion } from "@ce/soja-shared/faq";
import { createFileRoute } from "@tanstack/react-router";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { FAQ_ITEMS } from "@/lib/site-content";

const SUBTITLE =
  "Everything about shipping, shelf life and using our formulations. If your question isn't here, write to us.";
const PAGE_URL = `${SITE_URL}/faq`;

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: `FAQs | ${SITE_NAME}` },
      {
        name: "description",
        content: `Frequently asked questions about ${SITE_NAME} — shipping, shelf life, sensitivities and use.`,
      },
      { property: "og:title", content: `FAQs | ${SITE_NAME}` },
      { property: "og:description", content: SUBTITLE },
      { property: "og:type", content: "website" },
      { property: "og:url", content: PAGE_URL },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <main>
      <FaqAccordion items={FAQ_ITEMS} title="FAQs" subtitle={SUBTITLE} />
    </main>
  );
}
