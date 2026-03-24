<script lang="ts">
import { imagePaths } from "@ce/ui/lib/images";
import { ikResponsive } from "$lib/imagekit";
import ArrowRight from "lucide-svelte/icons/arrow-right";

const founders = ikResponsive(imagePaths.founders);
</script>

<section class="w-full mb-16 px-6">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
		<div class="space-y-4 max-w-[630px]">
			<h2 class="text-2xl font-normal text-foreground leading-tight md:text-xl">
				Jewelry Drawn From Shadows and Lines
			</h2>
			<p class="text-sm font-light text-foreground leading-relaxed">
				Linea was born from the meeting of two minds who saw beauty not just in ornament, but in
				structure. With backgrounds spanning architecture and fine arts, the founders believed that
				jewelry could be more than decoration — it could be an extension of space, light, and line.
			</p>
			<a
				href="/about/our-story"
				class="inline-flex items-center gap-1 text-sm font-light text-foreground hover:text-foreground/80 transition-colors duration-200"
			>
				<span>Read our full story</span>
				<ArrowRight size={12} />
			</a>
		</div>

		<div class="order-first md:order-last">
			<div class="w-full aspect-square overflow-hidden">
				<img
					src={founders.src}
					srcset={founders.srcset}
					sizes="(max-width: 768px) calc(100vw - 48px), calc(50vw - 48px)"
					alt="Linea founders - two women in minimalist jewelry"
					width={1792}
					height={1794}
					loading="lazy"
					decoding="async"
					class="w-full h-full object-cover"
				/>
			</div>
		</div>
	</div>
</section>
