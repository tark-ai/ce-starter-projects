import EditorialSection from "../components/content/EditorialSection";
import FiftyFiftySection from "../components/content/FiftyFiftySection";
import LargeHero from "../components/content/LargeHero";
import OneThirdTwoThirdsSection from "../components/content/OneThirdTwoThirdsSection";
import ProductCarousel from "../components/content/ProductCarousel";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import SEO, { FRAMEWORK, SITE_NAME, SITE_URL } from "../components/Seo";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        canonical={SITE_URL}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Commerce Engine",
            url: "https://www.commercengine.io",
            logo: `${SITE_URL}/favicon.svg`,
            description: `Commerce Engine is a headless e-commerce platform. ${SITE_NAME} is an open-source reference storefront built with ${FRAMEWORK}.`,
          },
        ]}
      />
      <Header />

      <main className="pt-6">
        <FiftyFiftySection />
        <ProductCarousel />
        <LargeHero />
        <OneThirdTwoThirdsSection />
        <EditorialSection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
