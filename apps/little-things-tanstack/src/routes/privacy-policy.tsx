import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPolicyView } from "@/components/legal/PrivacyPolicyView";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const Route = createFileRoute("/privacy-policy")({
  head: () => {
    const description = `How ${SITE_NAME} collects, uses, and protects your personal data.`;
    return {
      meta: [
        { title: `Privacy Policy | ${SITE_NAME}` },
        { name: "description", content: description },
        { property: "og:title", content: `Privacy Policy | ${SITE_NAME}` },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `${SITE_URL}/privacy-policy` },
      ],
      links: [{ rel: "canonical", href: `${SITE_URL}/privacy-policy` }],
    };
  },
  component: PrivacyPolicyView,
});
