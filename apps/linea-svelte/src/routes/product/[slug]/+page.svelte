<script lang="ts">
import ProductContent from "$lib/components/ProductContent.svelte";

let { data } = $props();
</script>

<div class="pt-6">
	<ProductContent product={data.product} similarItems={data.similarItems} />
</div>
