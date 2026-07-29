import type { Article } from "@ce/little-things-shared/blog";
import { ArticlePost as SharedArticlePost } from "@ce/little-things-shared/blog";
import { LittleThingsLink } from "@/lib/little-things-routing";

interface ArticlePostProps {
  article: Article;
  related?: Article[];
}

const ArticlePost = ({ article, related }: ArticlePostProps) => {
  return <SharedArticlePost article={article} related={related} LinkComponent={LittleThingsLink} />;
};

export default ArticlePost;
