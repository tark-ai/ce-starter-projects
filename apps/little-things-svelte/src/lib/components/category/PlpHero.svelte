<script lang="ts">
interface Props {
  title?: string;
  subtitle?: string;
  query?: string;
}

let {
  title = "Search all products.",
  subtitle = "Explore everything we offer in one place — no filters, no fluff.",
  query,
}: Props = $props();

const heading = $derived(query ? `Results for "${query}"` : title);
</script>

<section class="mx-auto w-full max-w-[1400px] border-b border-border px-6 py-16 md:py-20 lg:px-20">
	<h1 class="text-4xl font-bold tracking-tight text-foreground md:text-5xl">{heading}</h1>
	<p class="mt-4 text-lg font-light text-muted-foreground">{subtitle}</p>
</section>
