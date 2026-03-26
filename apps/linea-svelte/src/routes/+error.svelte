<script lang="ts">
import { page } from "$app/state";
</script>

<svelte:head>
	<title>Error | LINEA</title>
</svelte:head>

<div class="min-h-screen bg-background flex items-center justify-center p-6">
	<div class="text-center max-w-md">
		{#if page.status === 404}
			<h1 class="text-2xl font-light tracking-wide text-foreground mb-4">Page not found</h1>
			<p class="text-muted-foreground mb-8">The page you're looking for doesn't exist or has been moved.</p>
		{:else}
			<h1 class="text-2xl font-light tracking-wide text-foreground mb-4">Something went wrong</h1>
			<p class="text-muted-foreground mb-8">We apologize for the inconvenience. Please try again.</p>
		{/if}
		<a
			href="/"
			class="inline-block border border-foreground px-8 py-3 text-sm tracking-widest uppercase text-foreground hover:bg-foreground hover:text-background transition-colors"
		>
			Return Home
		</a>
	</div>
</div>
