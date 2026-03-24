<script lang="ts">
import { imagePaths } from "@ce/ui/lib/images";
import { ikResponsive } from "$lib/imagekit";

const earrings = ikResponsive(imagePaths.earringsCollection);
const bracelet = ikResponsive(imagePaths.linkBracelet);
</script>

<section class="w-full mb-16 px-6">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<div>
			<a href="/category/earrings" class="block">
				<div class="w-full aspect-square mb-3 overflow-hidden">
					<img
						src={earrings.src}
						srcset={earrings.srcset}
						sizes="(max-width: 768px) calc(100vw - 48px), calc(50vw - 36px)"
						alt="Earrings collection"
						width={1788}
						height={1792}
						loading="eager"
						fetchpriority="high"
						decoding="async"
						class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
					/>
				</div>
			</a>
			<div>
				<h3 class="text-sm font-normal text-foreground mb-1">Organic Forms</h3>
				<p class="text-sm font-light text-foreground">
					Nature-inspired pieces with fluid, sculptural details
				</p>
			</div>
		</div>

		<div>
			<a href="/category/bracelets" class="block">
				<div class="w-full aspect-square mb-3 overflow-hidden">
					<img
						src={bracelet.src}
						srcset={bracelet.srcset}
						sizes="(max-width: 768px) calc(100vw - 48px), calc(50vw - 36px)"
						alt="Chain link bracelet"
						width={1742}
						height={1744}
						loading="eager"
						decoding="async"
						class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
					/>
				</div>
			</a>
			<div>
				<h3 class="text-sm font-normal text-foreground mb-1">Chain Collection</h3>
				<p class="text-sm font-light text-foreground">
					Refined links and connections in precious metals
				</p>
			</div>
		</div>
	</div>
</section>
