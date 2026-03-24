<script lang="ts">
import EditorialSection from "$lib/components/EditorialSection.svelte";
import FiftyFiftySection from "$lib/components/FiftyFiftySection.svelte";
import LargeHero from "$lib/components/LargeHero.svelte";
import OneThirdTwoThirdsSection from "$lib/components/OneThirdTwoThirdsSection.svelte";
import ProductCarousel from "$lib/components/ProductCarousel.svelte";

let { data } = $props();
</script>

<div class="pt-6">
	<FiftyFiftySection />
	<ProductCarousel items={data.products} />
	<LargeHero />
	<OneThirdTwoThirdsSection />
	<EditorialSection />
</div>
