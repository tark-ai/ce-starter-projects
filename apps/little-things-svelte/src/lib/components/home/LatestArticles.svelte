<script lang="ts">
import type { Article } from "$lib/blog-data";
import { routeToHref } from "$lib/little-things-routing";
import ArticleCard from "../blog/ArticleCard.svelte";

interface Props {
  articles: Article[];
  heading?: string;
}

let { articles, heading = "Latest articles" }: Props = $props();
</script>

<section class="mx-auto w-full max-w-[1400px] px-6 py-16 lg:px-20">
	<div class="mb-8 flex items-center justify-between">
		<h2 class="font-display text-3xl italic text-foreground md:text-4xl">{heading}</h2>
		<a
			href={routeToHref({ path: '/blog' })}
			class="inline-flex h-9 items-center rounded-full bg-secondary px-4 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent"
		>
			Read all articles
		</a>
	</div>
	<div class="grid grid-cols-1 gap-2 md:grid-cols-3">
		{#each articles.slice(0, 3) as article (article.slug)}
			<ArticleCard {article} />
		{/each}
	</div>
</section>
