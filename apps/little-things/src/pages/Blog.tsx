import { useMemo, useState } from "react";
import { ARTICLES } from "@/lib/blog-data";
import ArticleCard from "../components/blog/ArticleCard";
import BlogHero from "../components/blog/BlogHero";
import TagFilterRow from "../components/blog/TagFilterRow";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";

const Blog = () => {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tags = useMemo(() => {
    const all = new Set<string>();
    for (const article of ARTICLES) {
      for (const tag of article.tags ?? []) all.add(tag);
    }
    return Array.from(all).sort();
  }, []);

  const visibleArticles = useMemo(() => {
    if (!activeTag) return ARTICLES;
    return ARTICLES.filter((article) => article.tags?.includes(activeTag));
  }, [activeTag]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <BlogHero />
        <TagFilterRow tags={tags} activeTag={activeTag} onSelectTag={setActiveTag} />

        <section className="mx-auto w-full max-w-[1400px] px-6 pb-20 lg:px-20">
          {visibleArticles.length === 0 ? (
            <p className="py-12 text-center text-sm font-light text-muted-foreground">
              No articles with that tag yet. Try another one?
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
              {visibleArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
