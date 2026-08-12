<script lang="ts">
import { cn } from "$lib/utils";
import Reveal from "../Reveal.svelte";

interface Props {
  image: string;
  imageAlt: string;
  title: string;
  content: string;
  imagePosition?: "left" | "right";
}

let { image, imageAlt, title, content, imagePosition = "left" }: Props = $props();
</script>

<Reveal
	as="section"
	class="soja-container grid items-center gap-10 py-16 tablet:grid-cols-2 tablet:gap-20 tablet:py-24"
>
	<img
		src={image}
		alt={imageAlt}
		loading="lazy"
		decoding="async"
		class={cn("aspect-4/3 w-full object-cover", imagePosition === "right" && "tablet:order-2")}
	/>
	<div class="flex flex-col gap-6">
		<h2 class="font-display text-title tracking-display">{title}</h2>
		<p class="max-w-[520px] text-meta leading-relaxed text-foreground/80">{content}</p>
	</div>
</Reveal>
