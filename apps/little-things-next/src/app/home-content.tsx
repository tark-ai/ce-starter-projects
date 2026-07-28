"use client";

import type { Item } from "@commercengine/storefront";
import BrowseCategories from "@/components/content/BrowseCategories";
import FeaturedProducts from "@/components/content/FeaturedProducts";
import Hero from "@/components/content/Hero";
import LatestArticles from "@/components/content/LatestArticles";
import { ARTICLES } from "@/lib/blog-data";

interface HomeContentProps {
  initialProducts: Item[];
}

export function HomeContent({ initialProducts }: HomeContentProps) {
  return (
    <main>
      <Hero />
      <FeaturedProducts items={initialProducts} isLoading={false} />
      <BrowseCategories />
      <LatestArticles articles={ARTICLES} />
    </main>
  );
}
