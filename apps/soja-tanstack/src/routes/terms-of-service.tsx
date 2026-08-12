import { createFileRoute } from "@tanstack/react-router";
import { TermsView } from "@/components/views/TermsView";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const PAGE_URL = `${SITE_URL}/terms-of-service`;

export const Route = createFileRoute("/terms-of-service")({
  head: () => ({
    meta: [
      { title: `Terms of Service | ${SITE_NAME}` },
      {
        name: "description",
        content: `The terms that govern your use of the ${SITE_NAME} website and the purchase of our products.`,
      },
      { property: "og:title", content: `Terms of Service | ${SITE_NAME}` },
      {
        property: "og:description",
        content: `The terms that govern your use of the ${SITE_NAME} website and the purchase of our products.`,
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/terms-of-service` },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
  }),
  component: TermsView,
});
