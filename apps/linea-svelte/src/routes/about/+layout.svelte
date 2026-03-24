<script lang="ts">
import type { Snippet } from "svelte";
import { page } from "$app/state";
import AboutSidebar from "$lib/components/about/AboutSidebar.svelte";

let { children }: { children: Snippet } = $props();
</script>

<div class="flex min-h-screen px-6 pt-8">
	<AboutSidebar currentPath={page.url.pathname} />
	<div class="flex-1 max-w-3xl">
		{@render children()}
	</div>
</div>
