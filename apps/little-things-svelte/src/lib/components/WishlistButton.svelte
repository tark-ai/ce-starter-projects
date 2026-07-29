<script lang="ts">
import { Heart } from "lucide-svelte";

interface Props {
  active: boolean;
  onclick: (e: MouseEvent) => void;
  class?: string;
}

let { active, onclick, class: className = "" }: Props = $props();
</script>

<button
	type="button"
	{onclick}
	class="absolute top-3 right-3 z-10 grid size-9 place-items-center rounded-full bg-background/85 backdrop-blur-sm shadow-sm hover:bg-background transition-colors {className}"
	aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
>
	<Heart
		class="size-4 transition-colors {active
			? 'fill-brand text-brand'
			: 'text-foreground/70 hover:text-foreground'}"
	/>
</button>
