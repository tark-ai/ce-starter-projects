import { images } from "@ce/ui/lib/images";
import { createFileRoute } from "@tanstack/react-router";
import AboutSidebar from "@/components/about/AboutSidebar";
import ContentSection from "@/components/about/ContentSection";
import ImageTextBlock from "@/components/about/ImageTextBlock";
import PageHeader from "@/components/about/PageHeader";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const Route = createFileRoute("/about/our-story")({
  head: () => ({
    meta: [
      {
        title: `Our Story | ${SITE_NAME}`,
      },
      {
        name: "description",
        content:
          "Discover the story behind LINEA — a journey of passion, craftsmanship, and timeless elegance in fine jewelry.",
      },
      {
        property: "og:title",
        content: `Our Story | ${SITE_NAME}`,
      },
      {
        property: "og:description",
        content:
          "Discover the story behind LINEA — a journey of passion, craftsmanship, and timeless elegance in fine jewelry.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/about/our-story` },
      { property: "og:image", content: `${SITE_URL}/og-image.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `Our Story | ${SITE_NAME}` },
      {
        name: "twitter:description",
        content:
          "Discover the story behind LINEA — a journey of passion, craftsmanship, and timeless elegance in fine jewelry.",
      },
      { name: "twitter:image", content: `${SITE_URL}/og-image.jpg` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/about/our-story` }],
  }),
  component: OurStoryPage,
});

function OurStoryPage() {
  return (
    <div className="flex">
      <div className="hidden lg:block">
        <AboutSidebar />
      </div>

      <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
        <PageHeader
          title="Our Story"
          subtitle="A journey of passion, craftsmanship, and timeless elegance"
        />

        <ContentSection>
          <ImageTextBlock
            image={images.founders}
            imageAlt="Company founders"
            title="Founded on Passion"
            content="LINEA Jewelry was born from a shared vision of creating timeless pieces that transcend fleeting trends. Our founders, united by their passion for exceptional craftsmanship and sustainable practices, established the brand with a commitment to creating jewelry that tells a story - your story."
            imagePosition="left"
          />
        </ContentSection>

        <ContentSection title="Our Heritage">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-xl font-light text-foreground">Traditional Craftsmanship</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every piece in our collection is meticulously handcrafted by skilled artisans who
                have honed their craft over generations. We honor traditional techniques while
                embracing modern innovation, ensuring each piece meets our exacting standards for
                quality and beauty.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-light text-foreground">Sustainable Future</h3>
              <p className="text-muted-foreground leading-relaxed">
                We believe luxury and sustainability can coexist beautifully. Our commitment to
                ethical sourcing, recycled materials, and responsible manufacturing practices
                ensures that every piece you wear contributes to a more sustainable future.
              </p>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Our Values">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-light text-foreground">Excellence</h3>
              <p className="text-muted-foreground">
                We pursue perfection in every detail, from the initial design concept to the final
                polish.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-light text-foreground">Authenticity</h3>
              <p className="text-muted-foreground">
                Each piece reflects genuine craftsmanship and tells an authentic story of artistry
                and care.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-light text-foreground">Innovation</h3>
              <p className="text-muted-foreground">
                We continuously evolve our designs and techniques while honoring timeless aesthetic
                principles.
              </p>
            </div>
          </div>
        </ContentSection>
      </main>
    </div>
  );
}
