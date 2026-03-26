import { createFileRoute } from "@tanstack/react-router";
import AboutSidebar from "@/components/about/AboutSidebar";
import ContentSection from "@/components/about/ContentSection";
import PageHeader from "@/components/about/PageHeader";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const Route = createFileRoute("/about/sustainability")({
  head: () => ({
    meta: [
      {
        title: `Sustainability | ${SITE_NAME}`,
      },
      {
        name: "description",
        content:
          "Learn about LINEA's commitment to ethical sourcing, sustainable materials, and responsible jewelry craftsmanship.",
      },
      {
        property: "og:title",
        content: `Sustainability | ${SITE_NAME}`,
      },
      {
        property: "og:description",
        content:
          "Learn about LINEA's commitment to ethical sourcing, sustainable materials, and responsible jewelry craftsmanship.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/about/sustainability` },
      { property: "og:image", content: `${SITE_URL}/og-image.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `Sustainability | ${SITE_NAME}` },
      {
        name: "twitter:description",
        content:
          "Learn about LINEA's commitment to ethical sourcing, sustainable materials, and responsible jewelry craftsmanship.",
      },
      { name: "twitter:image", content: `${SITE_URL}/og-image.jpg` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/about/sustainability` }],
  }),
  component: SustainabilityPage,
});

function SustainabilityPage() {
  return (
    <div className="flex">
      <div className="hidden lg:block">
        <AboutSidebar />
      </div>

      <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
        <PageHeader
          title="Sustainability"
          subtitle="Creating beautiful jewelry while protecting our planet for future generations"
        />

        <ContentSection title="Our Environmental Commitment">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="space-y-6">
              <h3 className="text-xl font-light text-foreground">Ethical Sourcing</h3>
              <p className="text-muted-foreground leading-relaxed">
                We partner only with suppliers who share our commitment to ethical practices. Every
                gemstone and precious metal in our collection is sourced responsibly, with full
                transparency in our supply chain.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-light text-foreground">Recycled Materials</h3>
              <p className="text-muted-foreground leading-relaxed">
                Over 80% of our precious metals come from recycled sources, reducing the
                environmental impact of mining while maintaining the highest quality standards for
                our jewelry.
              </p>
            </div>
          </div>

          <div className="bg-muted/10 rounded-lg p-8">
            <h3 className="text-2xl font-light text-foreground mb-6">Our Impact Goals</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-light text-primary mb-2">100%</div>
                <p className="text-sm text-muted-foreground">Carbon neutral operations by 2030</p>
              </div>
              <div>
                <div className="text-3xl font-light text-primary mb-2">90%</div>
                <p className="text-sm text-muted-foreground">Recycled packaging materials</p>
              </div>
              <div>
                <div className="text-3xl font-light text-primary mb-2">Zero</div>
                <p className="text-sm text-muted-foreground">Waste to landfill policy</p>
              </div>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Circular Economy">
          <div className="space-y-8">
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe in the power of circular design - creating jewelry that can be treasured,
              repaired, and eventually recycled into new pieces.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Lifetime Care</h3>
                <p className="text-muted-foreground">
                  Every piece comes with our lifetime care promise, including professional cleaning,
                  repairs, and resizing services.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Take-Back Program</h3>
                <p className="text-muted-foreground">
                  When you're ready for something new, we'll take back your LINEA jewelry to be
                  recycled into future pieces.
                </p>
              </div>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Certifications & Partnerships">
          <div className="space-y-8">
            <p className="text-muted-foreground leading-relaxed">
              Our commitment to sustainability is verified through partnerships with leading
              organizations and certifications that hold us accountable to the highest standards.
            </p>

            <div className="grid md:grid-cols-4 gap-8 items-center">
              <div className="h-16 w-32 bg-muted/10 rounded-lg flex items-center justify-center">
                <span className="text-xs text-muted-foreground">RJC Certified</span>
              </div>
              <div className="h-16 w-32 bg-muted/10 rounded-lg flex items-center justify-center">
                <span className="text-xs text-muted-foreground">B Corp</span>
              </div>
              <div className="h-16 w-32 bg-muted/10 rounded-lg flex items-center justify-center">
                <span className="text-xs text-muted-foreground">SCS Certified</span>
              </div>
              <div className="h-16 w-32 bg-muted/10 rounded-lg flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Fair Trade</span>
              </div>
            </div>
          </div>
        </ContentSection>
      </main>
    </div>
  );
}
