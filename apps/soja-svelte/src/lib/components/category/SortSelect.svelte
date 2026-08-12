<script lang="ts">
import { SORT_OPTIONS } from "$lib/sort-options";

interface Props {
  value: string;
  onchange: (value: string) => void;
  count?: number;
}

let { value, onchange, count }: Props = $props();
</script>

<div class="soja-container flex items-center justify-between gap-6 py-6">
	<span class="text-meta text-muted-foreground">
		{typeof count === "number" ? `${count} ${count === 1 ? "product" : "products"}` : " "}
	</span>
	<label class="flex items-center gap-3 text-meta">
		<span class="text-muted-foreground">Sort</span>
		<select
			{value}
			onchange={(event) => onchange((event.currentTarget as HTMLSelectElement).value)}
			class="border-0 border-b border-border bg-transparent py-1 text-meta outline-none focus:border-foreground"
		>
			{#each SORT_OPTIONS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</label>
</div>
