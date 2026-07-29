<script lang="ts">
import ArticlePost from "$lib/components/blog/ArticlePost.svelte";
import { SITE_NAME, SITE_URL } from "$lib/seo";

let { data } = $props();

const article = $derived(data.article);
const title = $derived(`${article.title} | ${SITE_NAME}`);
const url = $derived(`${SITE_URL}/blog/${article.slug}`);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={article.excerpt} />
	<link rel="canonical" href={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={article.excerpt} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={article.image} />
</svelte:head>

<ArticlePost {article} related={data.related} />
