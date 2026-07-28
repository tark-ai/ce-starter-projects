import { createFileRoute } from "@tanstack/react-router";
import { TermsView } from "@/components/legal/TermsView";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const Route = createFileRoute("/terms-of-service")({
  head: () => {
    const description = `The terms that govern your use of ${SITE_NAME}.`;
    return {
      meta: [
        { title: `Terms of Service | ${SITE_NAME}` },
        { name: "description", content: description },
        { property: "og:title", content: `Terms of Service | ${SITE_NAME}` },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `${SITE_URL}/terms-of-service` },
      ],
      links: [{ rel: "canonical", href: `${SITE_URL}/terms-of-service` }],
    };
  },
  component: TermsView,
});
