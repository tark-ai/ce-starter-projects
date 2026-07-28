<script lang="ts">
import { ArrowLeft, ArrowRight } from "lucide-svelte";
import type { Article } from "$lib/blog-data";
import { routeToHref } from "$lib/little-things-routing";
import ArticleCard from "./ArticleCard.svelte";

interface Props {
  article: Article;
  related?: Article[];
}

let { article, related = [] }: Props = $props();

const paragraphs = $derived(article.body ?? [article.excerpt]);
</script>

<article class="mx-auto w-full max-w-[1400px] px-6 py-12 lg:px-20">
	<div class="mx-auto max-w-3xl">
		<a
			href={routeToHref({ path: '/blog' })}
			class="inline-flex items-center gap-1 text-sm font-light text-muted-foreground transition-colors hover:text-foreground"
		>
			<ArrowLeft size={14} />
			<span>Read all articles</span>
		</a>

		<h1 class="mt-8 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
			{article.title}
		</h1>
		<p class="mt-4 text-sm uppercase tracking-wide text-muted-foreground">
			{article.author} on {article.date}
		</p>

		<div class="mt-8 aspect-video overflow-hidden rounded-lg bg-muted/40">
			<img
				src={article.image}
				alt={article.imageAlt || article.title}
				loading="eager"
				decoding="async"
				class="h-full w-full object-cover"
			/>
		</div>

		<div class="mt-10 space-y-6 text-base font-light leading-relaxed text-muted-foreground">
			{#each paragraphs as paragraph, index (index)}
				<p>{paragraph}</p>
			{/each}
		</div>

		{#if article.tags && article.tags.length > 0}
			<div class="mt-10 flex flex-wrap gap-2">
				{#each article.tags as tag (tag)}
					<span
						class="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium lowercase text-secondary-foreground"
					>
						{tag}
					</span>
				{/each}
			</div>
		{/if}
	</div>

	{#if related.length > 0}
		<div class="mx-auto mt-20 max-w-6xl border-t border-border pt-12">
			<div class="mb-8 flex items-center justify-between">
				<h2 class="text-2xl font-bold tracking-tight text-foreground">Keep reading</h2>
				<a
					href={routeToHref({ path: '/blog' })}
					class="inline-flex items-center gap-1 text-sm font-light text-brand transition-opacity hover:opacity-80"
				>
					<span>Read all articles</span>
					<ArrowRight size={14} />
				</a>
			</div>
			<div class="grid grid-cols-1 gap-2 md:grid-cols-3">
				{#each related as relatedArticle (relatedArticle.slug)}
					<ArticleCard article={relatedArticle} />
				{/each}
			</div>
		</div>
	{/if}
</article>
