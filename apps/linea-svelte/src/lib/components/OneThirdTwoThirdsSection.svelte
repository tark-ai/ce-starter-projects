<script lang="ts">
import { imagePaths } from "@ce/ui/lib/images";
import { ikResponsive } from "$lib/imagekit";

const organic = ikResponsive(imagePaths.organicEarring);
const circular = ikResponsive(imagePaths.circularCollection);
</script>

<section class="w-full mb-16 px-6">
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<div class="lg:col-span-1">
			<a href="/category/rings" class="block">
				<div class="w-full h-[500px] lg:h-[800px] mb-3 overflow-hidden">
					<img
						src={organic.src}
						srcset={organic.srcset}
						sizes="(max-width: 1024px) calc(100vw - 48px), calc(33vw - 40px)"
						alt="Artisan crafted jewelry"
						width={1590}
						height={1592}
						loading="lazy"
						decoding="async"
						class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
					/>
				</div>
			</a>
			<div>
				<h3 class="text-sm font-normal text-foreground mb-1">Artisan Craft</h3>
				<p class="text-sm font-light text-foreground">
					Handcrafted pieces with meticulous attention to detail
				</p>
			</div>
		</div>

		<div class="lg:col-span-2">
			<a href="/category/necklaces" class="block">
				<div class="w-full h-[500px] lg:h-[800px] mb-3 overflow-hidden">
					<img
						src={circular.src}
						srcset={circular.srcset}
						sizes="(max-width: 1024px) calc(100vw - 48px), calc(67vw - 40px)"
						alt="Circular jewelry collection"
						width={1792}
						height={1792}
						loading="lazy"
						decoding="async"
						class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
					/>
				</div>
			</a>
			<div>
				<h3 class="text-sm font-normal text-foreground mb-1">Circular Elements</h3>
				<p class="text-sm font-light text-foreground">
					Geometric perfection meets contemporary minimalism
				</p>
			</div>
		</div>
	</div>
</section>
