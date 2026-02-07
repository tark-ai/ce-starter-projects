import EditorialSection from "../components/content/EditorialSection";
import FiftyFiftySection from "../components/content/FiftyFiftySection";
import LargeHero from "../components/content/LargeHero";
import OneThirdTwoThirdsSection from "../components/content/OneThirdTwoThirdsSection";
import ProductCarousel from "../components/content/ProductCarousel";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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
