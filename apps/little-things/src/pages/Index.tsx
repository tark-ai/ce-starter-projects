import { ARTICLES } from "@/lib/blog-data";
import { useListSkus } from "@/lib/hooks";
import BrowseCategories from "../components/content/BrowseCategories";
import FeaturedProducts from "../components/content/FeaturedProducts";
import Hero from "../components/content/Hero";
import LatestArticles from "../components/content/LatestArticles";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";

const Index = () => {
  const { skus, isLoading } = useListSkus({ limit: 6 });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <Hero />
        <FeaturedProducts items={skus} isLoading={isLoading} />
        <BrowseCategories />
        <LatestArticles articles={ARTICLES} />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
