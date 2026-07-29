<script lang="ts">
interface Props {
  title?: string;
  subtitle?: string;
}

let {
  title = "Take a peek behind the curtain. Stories, thoughts and things we've been building.",
  subtitle = "From product drops to design philosophy — it's all here, straight from the source.",
}: Props = $props();
</script>

<section class="mx-auto w-full max-w-[1400px] px-6 py-16 md:py-24 lg:px-20">
	<div class="max-w-3xl">
		<h1 class="text-4xl font-bold tracking-tight text-foreground md:text-5xl">{title}</h1>
		<p class="mt-6 text-lg font-light text-muted-foreground">{subtitle}</p>
	</div>
</section>
