import { createFileRoute } from "@tanstack/react-router";
import { AboutView } from "@/components/views/AboutView";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { ABOUT_COPY } from "@/lib/site-content";

const PAGE_URL = `${SITE_URL}/about`;

export const Route = createFileRoute("/our-story")({
  head: () => ({
    meta: [
      { title: `Behind the brand | ${SITE_NAME}` },
      { name: "description", content: ABOUT_COPY.subtitle },
      { property: "og:title", content: `Behind the brand | ${SITE_NAME}` },
      { property: "og:description", content: ABOUT_COPY.subtitle },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/our-story` },
    ],
    // Aliases point at the primary route so the duplicate consolidates.
    links: [{ rel: "canonical", href: PAGE_URL }],
  }),
  component: AboutView,
});
