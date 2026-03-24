<script lang="ts">
let {
  image,
  imageAlt,
  title,
  content,
  imagePosition = "left",
}: {
  image: string;
  imageAlt: string;
  title: string;
  content: string;
  imagePosition?: "left" | "right";
} = $props();
</script>

<div
	class="flex flex-col {imagePosition === 'right'
		? 'lg:flex-row-reverse'
		: 'lg:flex-row'} gap-12 items-center"
>
	<div class="flex-1">
		<img
			src={image}
			alt={imageAlt}
			width="1792"
			height="1794"
			class="w-full aspect-square lg:aspect-auto lg:h-[800px] object-cover"
			loading="lazy"
		/>
	</div>
	<div class="flex-1 space-y-6">
		<h3 class="text-2xl font-light text-foreground">{title}</h3>
		<p class="text-muted-foreground leading-relaxed">{content}</p>
	</div>
</div>
