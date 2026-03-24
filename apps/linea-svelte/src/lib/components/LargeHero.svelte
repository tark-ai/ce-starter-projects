<script lang="ts">
import { imagePaths } from "@ce/ui/lib/images";
import { ikResponsive } from "$lib/imagekit";

const hero = ikResponsive(imagePaths.heroImage);
</script>

<section class="w-full mb-16 px-6">
	<div class="w-full aspect-[16/9] mb-3 overflow-hidden">
		<img
			src={hero.src}
			srcset={hero.srcset}
			sizes="calc(100vw - 48px)"
			alt="Modern jewelry collection"
			width={2690}
			height={1792}
			loading="lazy"
			decoding="async"
			class="w-full h-full object-cover"
		/>
	</div>
	<div>
		<h2 class="text-sm font-normal text-foreground mb-1">Modern Heritage</h2>
		<p class="text-sm font-light text-foreground">
			Contemporary jewelry crafted with timeless elegance
		</p>
	</div>
</section>
