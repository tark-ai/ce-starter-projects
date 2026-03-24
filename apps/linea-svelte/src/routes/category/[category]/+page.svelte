<script lang="ts">
import CategoryContent from "$lib/components/CategoryContent.svelte";

let { data } = $props();
</script>

<div class="pt-6">
	<CategoryContent
		category={data.displayName}
		categorySlug={data.categorySlug}
		initialSkus={data.skus}
		initialPagination={data.pagination}
	/>
</div>
