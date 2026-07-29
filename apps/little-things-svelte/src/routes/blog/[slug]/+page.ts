import { error } from "@sveltejs/kit";
import { ARTICLES, getArticleBySlug, getRelatedArticles } from "$lib/blog-data";
import type { EntryGenerator, PageLoad } from "./$types";

export const prerender = true;

export const entries: EntryGenerator = () => {
  return ARTICLES.map((article) => ({ slug: article.slug }));
};

export const load: PageLoad = ({ params }) => {
  const article = getArticleBySlug(params.slug);
  if (!article) {
    throw error(404, "Article not found");
  }
  return {
    article,
    related: getRelatedArticles(article.slug),
  };
};
