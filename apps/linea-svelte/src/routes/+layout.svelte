<script lang="ts">
import "../app.css";
import type { Snippet } from "svelte";
import { onMount } from "svelte";
import { checkout } from "$lib/checkout.svelte";
import Footer from "$lib/components/Footer.svelte";
import Navigation from "$lib/components/Navigation.svelte";
import { initStorefront } from "$lib/storefront";
import { wishlist } from "$lib/wishlist.svelte";

let { data, children }: { data: any; children: Snippet } = $props();

onMount(() => {
  initStorefront().then(() => {
    wishlist.load();
    checkout.init();
  });
});
</script>

<Navigation categories={data.categories} />
<main class="min-h-screen">
	{@render children()}
</main>
<Footer />
