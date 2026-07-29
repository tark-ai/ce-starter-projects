import { createFileRoute, notFound } from "@tanstack/react-router";
import ArticlePost from "@/components/blog/ArticlePost";
import { getArticleBySlug, getRelatedArticles } from "@/lib/blog-data";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const article = getArticleBySlug(params.slug);
    if (!article) throw notFound();
    return { article, related: getRelatedArticles(article.slug) };
  },
  head: ({ loaderData }) => {
    const article = loaderData?.article;
    if (!article) return { meta: [{ title: `Article not found | ${SITE_NAME}` }] };

    const articleUrl = `${SITE_URL}/blog/${article.slug}`;
    return {
      meta: [
        { title: `${article.title} | ${SITE_NAME}` },
        { name: "description", content: article.excerpt },
        { property: "og:title", content: `${article.title} | ${SITE_NAME}` },
        { property: "og:description", content: article.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:url", content: articleUrl },
        { property: "og:image", content: article.image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: `${article.title} | ${SITE_NAME}` },
        { name: "twitter:description", content: article.excerpt },
      ],
      links: [{ rel: "canonical", href: articleUrl }],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const { article, related } = Route.useLoaderData();

  return (
    <main className="pt-6">
      <ArticlePost article={article} related={related} />
    </main>
  );
}
