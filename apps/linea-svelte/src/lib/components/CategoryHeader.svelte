<script lang="ts">
let { category }: { category: string } = $props();

const capitalizedCategory = $derived(category.charAt(0).toUpperCase() + category.slice(1));
</script>

<section class="w-full px-6 mb-8">
	<div class="mb-6">
		<nav aria-label="Breadcrumb">
			<ol class="flex items-center gap-1.5 text-sm text-muted-foreground">
				<li><a href="/" class="hover:text-foreground transition-colors">Home</a></li>
				<li class="text-muted-foreground/50">/</li>
				<li class="text-foreground">{capitalizedCategory}</li>
			</ol>
		</nav>
	</div>
	<h1 class="text-3xl md:text-4xl font-light text-foreground">{capitalizedCategory}</h1>
</section>
