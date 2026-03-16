import type { Item } from "@commercengine/storefront";
import Providers from "../Providers";
import EditorialSection from "./EditorialSection";
import FiftyFiftySection from "./FiftyFiftySection";
import LargeHero from "./LargeHero";
import OneThirdTwoThirdsSection from "./OneThirdTwoThirdsSection";
import ProductCarousel from "./ProductCarousel";

interface HomeContentProps {
  initialProducts: Item[];
}

export default function HomeContent({ initialProducts }: HomeContentProps) {
  return (
    <Providers>
      <main className="pt-6">
        <FiftyFiftySection />
        <ProductCarousel serverProducts={initialProducts} />
        <LargeHero />
        <OneThirdTwoThirdsSection />
        <EditorialSection />
      </main>
    </Providers>
  );
}
