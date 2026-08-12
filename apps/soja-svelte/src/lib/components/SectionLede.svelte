<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "$lib/utils";

interface Props {
  children: Snippet;
  class?: string;
  as?: "h1" | "h2" | "p";
}

let { children, class: className = "", as = "h2" }: Props = $props();
</script>

<svelte:element
	this={as}
	class={cn("max-w-[600px] font-display text-title tracking-display", className)}
>
	{@render children()}
</svelte:element>
