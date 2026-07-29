<script lang="ts">
interface Props {
  image: string;
  imageAlt: string;
  title: string;
  content: string;
  imagePosition?: "left" | "right";
}

let { image, imageAlt, title, content, imagePosition = "left" }: Props = $props();
</script>

<section class="w-full px-6 py-16">
	<div
		class="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 lg:grid-cols-2 {imagePosition ===
		'right'
			? 'lg:[&>*:first-child]:order-last'
			: ''}"
	>
		<div class="aspect-[4/3] overflow-hidden rounded-lg bg-muted/40">
			<img src={image} alt={imageAlt} loading="lazy" decoding="async" class="h-full w-full object-cover" />
		</div>
		<div class="space-y-4">
			<h3 class="text-2xl font-bold tracking-tight text-foreground">{title}</h3>
			<p class="text-base font-light leading-relaxed text-muted-foreground">{content}</p>
		</div>
	</div>
</section>
