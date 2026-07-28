<script lang="ts">
import { images } from "@ce/little-things-ui/lib/images";
import ContentSection from "$lib/components/about/ContentSection.svelte";
import ImageTextBlock from "$lib/components/about/ImageTextBlock.svelte";
import PageHeader from "$lib/components/about/PageHeader.svelte";
import { SITE_NAME, SITE_URL } from "$lib/seo";

const title = `About | ${SITE_NAME}`;
const description =
  "Little Things is a tight, opinionated catalog of things worth owning — honest copy, kind service, and nothing that wastes your time.";
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={`${SITE_URL}/about`} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={`${SITE_URL}/about`} />
</svelte:head>

<PageHeader
	title="We sell the good stuff, minus the fluff."
	subtitle="Little Things started with a simple, mildly petty idea: shopping for everyday goods shouldn't feel like a chore. So we rounded up the things worth owning, wrote honest descriptions, and skipped the nonsense."
	ctaLabel="Browse all products"
	ctaRoute={{ path: '/all-products' }}
/>

<ImageTextBlock
	image={images.editorialOne}
	imageAlt="The Little Things studio"
	title="Founded on good taste and low patience"
	content="We're a small team that got tired of clicking through ten pages of near-identical products to find one decent thing. Little Things is our fix: a tight, opinionated catalog where everything earns its spot. If we wouldn't buy it ourselves, it doesn't make the cut."
	imagePosition="left"
/>

<ImageTextBlock
	image={images.editorialTwo}
	imageAlt="Products being packed"
	title="Boringly reliable, on purpose"
	content="Free shipping, honest stock counts, and returns that don't require a signed affidavit. The exciting part is the products; the logistics should just quietly work. That's the whole philosophy, and we're weirdly proud of it."
	imagePosition="right"
/>

<ContentSection title="What we actually care about">
	{#snippet children()}
		<div class="grid gap-8 md:grid-cols-3">
			<div class="space-y-2">
				<h3 class="text-lg font-semibold text-foreground">Fewer, better</h3>
				<p>
					A short list of things we genuinely rate beats an endless scroll of maybes. We'd rather
					stock one great option than twelve okay ones.
				</p>
			</div>
			<div class="space-y-2">
				<h3 class="text-lg font-semibold text-foreground">Honest copy</h3>
				<p>
					No breathless marketing. We tell you what a thing does, what it doesn't, and whether it's
					worth the money. Radical, we know.
				</p>
			</div>
			<div class="space-y-2">
				<h3 class="text-lg font-semibold text-foreground">Kind by default</h3>
				<p>
					Real humans answer the emails, returns are painless, and we sweat the small stuff so you
					don't have to.
				</p>
			</div>
		</div>
	{/snippet}
</ContentSection>
