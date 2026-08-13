<script lang="ts">
import { page } from "$app/state";
import { SITE_NAME } from "$lib/seo";
</script>

<svelte:head>
	<title>{page.status === 404 ? "Page not found" : "Something went wrong"} | {SITE_NAME}</title>
	<meta name="robots" content="noindex, follow" />
</svelte:head>

<main class="soja-container py-32 tablet:py-48">
	{#if page.status === 404}
		<h1 class="font-display text-[2rem] tracking-display tablet:text-display">
			This page has gone quiet
		</h1>
		<p class="mt-6 max-w-[420px] text-meta leading-relaxed text-muted-foreground">
			The page you were looking for isn't here. Return to the collection.
		</p>
	{:else}
		<h1 class="font-display text-[2rem] tracking-display tablet:text-display">
			Something went wrong
		</h1>
		<p class="mt-6 max-w-[420px] text-meta leading-relaxed text-muted-foreground">
			That didn't load as it should. Try again in a moment.
		</p>
	{/if}
	<a
		href="/all-products"
		class="mt-10 inline-flex items-center gap-2 text-meta transition-opacity duration-300 ease-soja hover:opacity-60"
	>
		Shop the collection
		<span aria-hidden="true" class="h-1.5 w-1.5 bg-current"></span>
	</a>
</main>
