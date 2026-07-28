/** biome-ignore-all lint/style/useComponentExportOnlyModules: Next.js page conventions */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticlePost from "@/components/blog/ArticlePost";
import { ARTICLES, getArticleBySlug, getRelatedArticles } from "@/lib/blog-data";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) return { title: "Article not found" };

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: `${article.title} | ${SITE_NAME}`,
      description: article.excerpt,
      type: "article",
      url: `${SITE_URL}/blog/${article.slug}`,
      images: [{ url: article.image }],
    },
    twitter: {
      title: `${article.title} | ${SITE_NAME}`,
      description: article.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="pt-6">
      <ArticlePost article={article} related={getRelatedArticles(article.slug)} />
    </main>
  );
}
