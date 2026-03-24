<script lang="ts">
import { images } from "@ce/ui/lib/images";
import ContentSection from "$lib/components/about/ContentSection.svelte";
import ImageTextBlock from "$lib/components/about/ImageTextBlock.svelte";
import PageHeader from "$lib/components/about/PageHeader.svelte";
</script>

<PageHeader title="Our Story" subtitle="A journey of passion, craftsmanship, and timeless elegance" />

<ContentSection>
	<ImageTextBlock
		image={images.founders}
		imageAlt="Company founders"
		title="Founded on Passion"
		content="LINEA Jewelry was born from a shared vision of creating timeless pieces that transcend fleeting trends. Our founders, united by their passion for exceptional craftsmanship and sustainable practices, established the brand with a commitment to creating jewelry that tells a story - your story."
		imagePosition="left"
	/>
</ContentSection>

<ContentSection title="Our Heritage">
	<div class="grid md:grid-cols-2 gap-12">
		<div class="space-y-6">
			<h3 class="text-xl font-light text-foreground">Traditional Craftsmanship</h3>
			<p class="text-muted-foreground leading-relaxed">
				Every piece in our collection is meticulously handcrafted by skilled artisans who have
				honed their craft over generations. We honor traditional techniques while embracing modern
				innovation, ensuring each piece meets our exacting standards for quality and beauty.
			</p>
		</div>
		<div class="space-y-6">
			<h3 class="text-xl font-light text-foreground">Sustainable Future</h3>
			<p class="text-muted-foreground leading-relaxed">
				We believe luxury and sustainability can coexist beautifully. Our commitment to ethical
				sourcing, recycled materials, and responsible manufacturing practices ensures that every
				piece you wear contributes to a more sustainable future.
			</p>
		</div>
	</div>
</ContentSection>

<ContentSection title="Our Values">
	<div class="grid md:grid-cols-3 gap-8">
		<div class="space-y-4">
			<h3 class="text-lg font-light text-foreground">Excellence</h3>
			<p class="text-muted-foreground">
				We pursue perfection in every detail, from the initial design concept to the final polish.
			</p>
		</div>
		<div class="space-y-4">
			<h3 class="text-lg font-light text-foreground">Authenticity</h3>
			<p class="text-muted-foreground">
				Each piece reflects genuine craftsmanship and tells an authentic story of artistry and
				care.
			</p>
		</div>
		<div class="space-y-4">
			<h3 class="text-lg font-light text-foreground">Innovation</h3>
			<p class="text-muted-foreground">
				We continuously evolve our designs and techniques while honoring timeless aesthetic
				principles.
			</p>
		</div>
	</div>
</ContentSection>
