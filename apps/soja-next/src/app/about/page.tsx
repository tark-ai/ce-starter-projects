/** biome-ignore-all lint/style/useComponentExportOnlyModules: Next.js page conventions */

import { images } from "@ce/soja-ui/lib/images";
import type { Metadata } from "next";
import ImageTextBlock from "@/components/about/ImageTextBlock";
import PageHeader from "@/components/about/PageHeader";
import BrandPillars from "@/components/content/BrandPillars";
import { OG_IMAGES, SITE_NAME, SITE_URL } from "@/lib/constants";
import { ABOUT_COPY } from "@/lib/site-content";

export const metadata: Metadata = {
  title: ABOUT_COPY.title,
  description: ABOUT_COPY.subtitle,
  openGraph: {
    title: `${ABOUT_COPY.title} | ${SITE_NAME}`,
    description: ABOUT_COPY.subtitle,
    type: "website",
    url: `${SITE_URL}/about`,
    images: OG_IMAGES,
  },
};

export default function AboutPage() {
  return (
    <main>
      <PageHeader title={ABOUT_COPY.title} subtitle={ABOUT_COPY.subtitle} />
      <ImageTextBlock
        image={images.storyFounder}
        imageAlt="Soja's founder in the Copenhagen laboratory"
        title={ABOUT_COPY.whoWeAre.title}
        content={ABOUT_COPY.whoWeAre.content}
      />
      <ImageTextBlock
        image={images.storyLab}
        imageAlt="Hand-crafted formulations in small batches"
        title={ABOUT_COPY.ourValues.title}
        content={ABOUT_COPY.ourValues.content}
        imagePosition="right"
      />
      <BrandPillars />
    </main>
  );
}
