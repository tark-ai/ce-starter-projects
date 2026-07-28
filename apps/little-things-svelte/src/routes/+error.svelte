<script lang="ts">
import { page } from "$app/state";
</script>

<svelte:head>
	<title>Error | Little Things</title>
</svelte:head>

<div class="flex min-h-[60vh] items-center justify-center p-6">
	<div class="max-w-md text-center">
		{#if page.status === 404}
			<h1 class="mb-4 font-display text-4xl italic text-foreground">Page not found</h1>
			<p class="mb-8 text-muted-foreground">
				This page seems to have wandered off. Let's get you back to the good stuff.
			</p>
		{:else}
			<h1 class="mb-4 font-display text-4xl italic text-foreground">Something went wrong</h1>
			<p class="mb-8 text-muted-foreground">
				We apologize for the inconvenience. Please try again.
			</p>
		{/if}
		<a
			href="/"
			class="inline-flex h-12 items-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
		>
			Return home
		</a>
	</div>
</div>
