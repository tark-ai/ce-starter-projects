import type { Item } from "@commercengine/storefront";
import { ARTICLES } from "@/lib/blog-data";
import Providers from "../Providers";
import BrowseCategories from "./BrowseCategories";
import FeaturedProducts from "./FeaturedProducts";
import Hero from "./Hero";
import LatestArticles from "./LatestArticles";

interface HomeContentProps {
  initialProducts: Item[];
}

export default function HomeContent({ initialProducts }: HomeContentProps) {
  return (
    <Providers>
      <main>
        <Hero />
        <FeaturedProducts items={initialProducts} isLoading={false} />
        <BrowseCategories />
        <LatestArticles articles={ARTICLES} />
      </main>
    </Providers>
  );
}
