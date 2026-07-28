import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { BlogContent } from "./blog-content";

export const metadata: Metadata = {
  title: "Blog",
  description: `Stories, thoughts, and things we've been building at ${SITE_NAME}.`,
  openGraph: {
    title: `Blog | ${SITE_NAME}`,
    description: `Stories, thoughts, and things we've been building at ${SITE_NAME}.`,
    type: "website",
    url: `${SITE_URL}/blog`,
  },
};

export default function BlogPage() {
  return <BlogContent />;
}
