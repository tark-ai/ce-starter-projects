<script lang="ts">
import { Heart } from "lucide-svelte";
import { cn } from "$lib/utils";

interface Props {
  active: boolean;
  onclick: (event: MouseEvent) => void;
  variant?: "overlay" | "control";
  class?: string;
}

let { active, onclick, variant = "overlay", class: className = "" }: Props = $props();

const VARIANTS = {
  overlay: "p-1.5 text-white drop-shadow-[0_1px_3px_rgb(0_0_0/0.45)]",
  control:
    "flex h-12 w-12 shrink-0 items-center justify-center border border-border hover:border-foreground",
} as const;
</script>

<button
	type="button"
	{onclick}
	aria-pressed={active}
	aria-label={active ? "Remove from favourites" : "Add to favourites"}
	class={cn(
		"transition-[opacity,border-color] duration-300 ease-soja hover:opacity-60",
		VARIANTS[variant],
		className
	)}
>
	<Heart class={cn("h-4 w-4", active && "fill-current")} strokeWidth={1.25} />
</button>
