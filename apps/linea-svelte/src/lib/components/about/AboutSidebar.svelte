<script lang="ts">
let { currentPath }: { currentPath: string } = $props();

const aboutPages = [
  { name: "Our Story", path: "/about/our-story" },
  { name: "Sustainability", path: "/about/sustainability" },
  { name: "Size Guide", path: "/about/size-guide" },
  { name: "Customer Care", path: "/about/customer-care" },
  { name: "Store Locator", path: "/about/store-locator" },
];
</script>

<aside class="hidden md:block w-64 sticky top-32 h-fit px-6">
	<nav class="space-y-1">
		<h3 class="text-lg font-light text-foreground mb-6">About</h3>
		{#each aboutPages as aboutPage (aboutPage.path)}
			<a
				href={aboutPage.path}
				class="block py-2 text-sm font-light transition-all {currentPath === aboutPage.path
					? 'text-primary underline decoration-2 underline-offset-4'
					: 'text-muted-foreground hover:text-foreground hover:underline hover:decoration-1 hover:underline-offset-4'}"
			>
				{aboutPage.name}
			</a>
		{/each}
	</nav>
</aside>
