<script lang="ts">
import { SITE_NAME, SITE_URL } from "$lib/seo";
import ContentSection from "$lib/components/about/ContentSection.svelte";
import PageHeader from "$lib/components/about/PageHeader.svelte";

const title = `Sustainability | ${SITE_NAME}`;
const description = "Learn about LINEA's commitment to ethical sourcing, sustainable materials, and responsible jewelry craftsmanship.";
const url = `${SITE_URL}/about/sustainability`;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
</svelte:head>

<PageHeader
	title="Sustainability"
	subtitle="Creating beautiful jewelry while protecting our planet for future generations"
/>

<ContentSection title="Our Environmental Commitment">
	<div class="grid md:grid-cols-2 gap-12 mb-16">
		<div class="space-y-6">
			<h3 class="text-xl font-light text-foreground">Ethical Sourcing</h3>
			<p class="text-muted-foreground leading-relaxed">
				We partner only with suppliers who share our commitment to ethical practices. Every
				gemstone and precious metal in our collection is sourced responsibly, with full
				transparency in our supply chain.
			</p>
		</div>
		<div class="space-y-6">
			<h3 class="text-xl font-light text-foreground">Recycled Materials</h3>
			<p class="text-muted-foreground leading-relaxed">
				Over 80% of our precious metals come from recycled sources, reducing the environmental
				impact of mining while maintaining the highest quality standards for our jewelry.
			</p>
		</div>
	</div>

	<div class="bg-muted/10 rounded-lg p-8">
		<h3 class="text-2xl font-light text-foreground mb-6">Our Impact Goals</h3>
		<div class="grid md:grid-cols-3 gap-8">
			<div>
				<div class="text-3xl font-light text-primary mb-2">100%</div>
				<p class="text-sm text-muted-foreground">Carbon neutral operations by 2030</p>
			</div>
			<div>
				<div class="text-3xl font-light text-primary mb-2">90%</div>
				<p class="text-sm text-muted-foreground">Recycled packaging materials</p>
			</div>
			<div>
				<div class="text-3xl font-light text-primary mb-2">Zero</div>
				<p class="text-sm text-muted-foreground">Waste to landfill policy</p>
			</div>
		</div>
	</div>
</ContentSection>

<ContentSection title="Circular Economy">
	<div class="space-y-8">
		<p class="text-lg text-muted-foreground leading-relaxed">
			We believe in the power of circular design - creating jewelry that can be treasured,
			repaired, and eventually recycled into new pieces.
		</p>

		<div class="grid md:grid-cols-2 gap-8">
			<div class="space-y-4">
				<h3 class="text-lg font-light text-foreground">Lifetime Care</h3>
				<p class="text-muted-foreground">
					Every piece comes with our lifetime care promise, including professional cleaning,
					repairs, and resizing services.
				</p>
			</div>
			<div class="space-y-4">
				<h3 class="text-lg font-light text-foreground">Take-Back Program</h3>
				<p class="text-muted-foreground">
					When you're ready for something new, we'll take back your LINEA jewelry to be recycled
					into future pieces.
				</p>
			</div>
		</div>
	</div>
</ContentSection>

<ContentSection title="Certifications & Partnerships">
	<div class="space-y-8">
		<p class="text-muted-foreground leading-relaxed">
			Our commitment to sustainability is verified through partnerships with leading organizations
			and certifications that hold us accountable to the highest standards.
		</p>

		<div class="grid md:grid-cols-4 gap-8 items-center">
			<div class="h-16 w-32 bg-muted/10 rounded-lg flex items-center justify-center">
				<span class="text-xs text-muted-foreground">RJC Certified</span>
			</div>
			<div class="h-16 w-32 bg-muted/10 rounded-lg flex items-center justify-center">
				<span class="text-xs text-muted-foreground">B Corp</span>
			</div>
			<div class="h-16 w-32 bg-muted/10 rounded-lg flex items-center justify-center">
				<span class="text-xs text-muted-foreground">SCS Certified</span>
			</div>
			<div class="h-16 w-32 bg-muted/10 rounded-lg flex items-center justify-center">
				<span class="text-xs text-muted-foreground">Fair Trade</span>
			</div>
		</div>
	</div>
</ContentSection>
