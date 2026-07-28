import { Link, useParams } from "react-router-dom";
import { getArticleBySlug, getRelatedArticles } from "@/lib/blog-data";
import ArticlePost from "../components/blog/ArticlePost";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";

const BlogPost = () => {
  const { slug } = useParams();
  const article = slug ? getArticleBySlug(slug) : undefined;

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-[1400px] px-6 pt-6 lg:px-20 text-center py-24">
          <h1 className="mb-4 text-2xl font-bold text-foreground">Article not found</h1>
          <p className="mb-6 text-sm font-light text-muted-foreground">
            This story seems to have wandered off. Let's get you back to the good ones.
          </p>
          <Link
            to="/blog"
            className="text-sm font-medium text-brand underline hover:opacity-80 transition-opacity"
          >
            Read all articles
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-6">
        <ArticlePost article={article} related={getRelatedArticles(article.slug)} />
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
