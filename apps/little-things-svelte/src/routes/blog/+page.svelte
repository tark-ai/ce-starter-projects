<script lang="ts">
import { ARTICLES } from "$lib/blog-data";
import ArticleCard from "$lib/components/blog/ArticleCard.svelte";
import BlogHero from "$lib/components/blog/BlogHero.svelte";
import TagFilterRow from "$lib/components/blog/TagFilterRow.svelte";
import { SITE_NAME, SITE_URL } from "$lib/seo";

let activeTag = $state<string | null>(null);

const tags = (() => {
  const all = new Set<string>();
  for (const article of ARTICLES) {
    for (const tag of article.tags ?? []) all.add(tag);
  }
  return Array.from(all).sort();
})();

const visibleArticles = $derived(
  activeTag ? ARTICLES.filter((article) => article.tags?.includes(activeTag ?? "")) : ARTICLES
);
</script>

<svelte:head>
	<title>Blog | {SITE_NAME}</title>
	<meta
		name="description"
		content="Stories, thoughts and things we've been building — from product drops to design philosophy."
	/>
	<link rel="canonical" href={`${SITE_URL}/blog`} />
</svelte:head>

<BlogHero />
<TagFilterRow {tags} {activeTag} onselecttag={(tag) => (activeTag = tag)} />

<section class="mx-auto w-full max-w-[1400px] px-6 pb-20 lg:px-20">
	{#if visibleArticles.length === 0}
		<p class="py-12 text-center text-sm font-light text-muted-foreground">
			No articles with that tag yet. Try another one?
		</p>
	{:else}
		<div class="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
			{#each visibleArticles as article (article.slug)}
				<ArticleCard {article} />
			{/each}
		</div>
	{/if}
</section>
