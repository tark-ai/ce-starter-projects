<script lang="ts">
import type { Article } from "$lib/blog-data";
import { routeToHref } from "$lib/little-things-routing";

interface Props {
  article: Article;
}

let { article }: Props = $props();
</script>

<a href={routeToHref({ path: `/blog/${article.slug}` })} class="group block">
	<div class="aspect-video overflow-hidden rounded-lg bg-muted/40">
		<img
			src={article.image}
			alt={article.imageAlt || article.title}
			loading="lazy"
			decoding="async"
			class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
		/>
	</div>
	<div class="mt-4 space-y-2">
		<h3 class="text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-brand">
			{article.title}
		</h3>
		<p class="text-xs uppercase tracking-wide text-muted-foreground">
			{article.author} on {article.date}
		</p>
		<p class="line-clamp-2 text-sm font-light leading-relaxed text-muted-foreground">
			{article.excerpt}
		</p>
	</div>
</a>
