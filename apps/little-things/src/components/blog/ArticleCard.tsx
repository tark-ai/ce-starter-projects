import type { Article } from "@ce/little-things-shared/blog";
import { ArticleCard as SharedArticleCard } from "@ce/little-things-shared/blog";
import { LittleThingsLink } from "@/lib/little-things-routing";

interface ArticleCardProps {
  article: Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  return <SharedArticleCard article={article} LinkComponent={LittleThingsLink} />;
};

export default ArticleCard;
