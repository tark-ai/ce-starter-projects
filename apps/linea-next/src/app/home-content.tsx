"use client";

import type { Item } from "@commercengine/storefront";
import EditorialSection from "@/components/content/EditorialSection";
import FiftyFiftySection from "@/components/content/FiftyFiftySection";
import LargeHero from "@/components/content/LargeHero";
import OneThirdTwoThirdsSection from "@/components/content/OneThirdTwoThirdsSection";
import ProductCarousel from "@/components/content/ProductCarousel";

interface HomeContentProps {
  initialProducts: Item[];
}

export function HomeContent({ initialProducts }: HomeContentProps) {
  return (
    <main className="pt-6">
      <FiftyFiftySection />
      <ProductCarousel serverProducts={initialProducts} />
      <LargeHero />
      <OneThirdTwoThirdsSection />
      <EditorialSection />
    </main>
  );
}
