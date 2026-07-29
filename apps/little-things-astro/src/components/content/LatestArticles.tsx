import type { Article } from "@ce/little-things-shared/blog";
import { LatestArticles as SharedLatestArticles } from "@ce/little-things-shared/content";
import { LittleThingsLink } from "@/lib/little-things-routing";

interface LatestArticlesProps {
  articles?: Article[];
}

const LatestArticles = ({ articles }: LatestArticlesProps) => {
  return <SharedLatestArticles articles={articles} LinkComponent={LittleThingsLink} />;
};

export default LatestArticles;
