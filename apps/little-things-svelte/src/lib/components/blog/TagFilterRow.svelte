<script lang="ts">
interface Props {
  tags: string[];
  activeTag?: string | null;
  onselecttag: (tag: string | null) => void;
}

let { tags, activeTag = null, onselecttag }: Props = $props();

function pillClass(active: boolean): string {
  return `inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-light transition-colors ${
    active
      ? "border-foreground bg-foreground text-background"
      : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
  }`;
}
</script>

<section class="mx-auto w-full max-w-[1400px] px-6 pb-8 lg:px-20">
	<div class="flex flex-wrap gap-2">
		<button
			type="button"
			class={pillClass(!activeTag)}
			aria-pressed={!activeTag}
			onclick={() => onselecttag(null)}
		>
			All
		</button>
		{#each tags as tag (tag)}
			<button
				type="button"
				class={pillClass(activeTag === tag)}
				aria-pressed={activeTag === tag}
				onclick={() => onselecttag(tag)}
			>
				{tag}
			</button>
		{/each}
	</div>
</section>
