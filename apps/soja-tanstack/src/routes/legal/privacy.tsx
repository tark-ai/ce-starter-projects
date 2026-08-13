import { createFileRoute } from "@tanstack/react-router";
import { PrivacyView } from "@/components/views/PrivacyView";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const PAGE_URL = `${SITE_URL}/privacy-policy`;

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({
    meta: [
      { title: `Privacy Policy | ${SITE_NAME}` },
      {
        name: "description",
        content: `How ${SITE_NAME} collects, uses, discloses and safeguards your personal information.`,
      },
      { property: "og:title", content: `Privacy Policy | ${SITE_NAME}` },
      {
        property: "og:description",
        content: `How ${SITE_NAME} collects, uses, discloses and safeguards your personal information.`,
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/legal/privacy` },
    ],
    // Aliases point at the primary route so the duplicate consolidates.
    links: [{ rel: "canonical", href: PAGE_URL }],
  }),
  component: PrivacyView,
});
