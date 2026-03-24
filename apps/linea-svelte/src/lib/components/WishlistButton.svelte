<script lang="ts">
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
	class="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors {className}"
	aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill={active ? 'currentColor' : 'none'}
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="w-4 h-4 transition-colors {active ? 'text-red-500' : 'text-foreground/70 hover:text-foreground'}"
		role="img"
		aria-label="Heart icon"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
		/>
	</svg>
</button>
