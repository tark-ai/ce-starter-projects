<script lang="ts">
import { images } from "@ce/soja-ui/lib/images";
import { ABOUT_COPY } from "$lib/site-content";
import BrandPillars from "../home/BrandPillars.svelte";
import ImageTextBlock from "./ImageTextBlock.svelte";
import PageHeader from "./PageHeader.svelte";
</script>

<main>
	<PageHeader title={ABOUT_COPY.title} subtitle={ABOUT_COPY.subtitle} />
	<ImageTextBlock
		image={images.storyFounder}
		imageAlt="Soja's founder in the Copenhagen laboratory"
		title={ABOUT_COPY.whoWeAre.title}
		content={ABOUT_COPY.whoWeAre.content}
	/>
	<ImageTextBlock
		image={images.storyLab}
		imageAlt="Hand-crafted formulations in small batches"
		title={ABOUT_COPY.ourValues.title}
		content={ABOUT_COPY.ourValues.content}
		imagePosition="right"
	/>
	<BrandPillars />
</main>
