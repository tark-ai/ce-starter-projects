<script lang="ts">
import type { Item } from "@commercengine/storefront";
import ProductSection from "../category/ProductSection.svelte";

interface Props {
  items: Item[];
  title?: string;
}

let { items, title = "You might also like" }: Props = $props();
</script>

<ProductSection {title} {items} />
