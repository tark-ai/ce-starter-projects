<script lang="ts">
import { Minus, Plus } from "lucide-svelte";

interface Props {
  value: number;
  onchange: (value: number) => void;
  max?: number;
}

let { value, onchange, max = 99 }: Props = $props();
</script>

<div class="flex h-12 w-fit items-center border border-border">
	<button
		type="button"
		onclick={() => onchange(Math.max(1, value - 1))}
		disabled={value <= 1}
		aria-label="Decrease quantity"
		class="flex h-full w-11 items-center justify-center transition-opacity duration-300 ease-soja hover:opacity-60 disabled:pointer-events-none disabled:opacity-30"
	>
		<Minus class="h-3 w-3" strokeWidth={1.5} />
	</button>
	<span aria-live="polite" class="w-8 text-center text-meta">{value}</span>
	<button
		type="button"
		onclick={() => onchange(Math.min(max, value + 1))}
		disabled={value >= max}
		aria-label="Increase quantity"
		class="flex h-full w-11 items-center justify-center transition-opacity duration-300 ease-soja hover:opacity-60 disabled:pointer-events-none disabled:opacity-30"
	>
		<Plus class="h-3 w-3" strokeWidth={1.5} />
	</button>
</div>
