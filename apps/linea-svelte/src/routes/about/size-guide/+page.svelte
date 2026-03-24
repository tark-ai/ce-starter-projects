<script lang="ts">
import ContentSection from "$lib/components/about/ContentSection.svelte";
import PageHeader from "$lib/components/about/PageHeader.svelte";

const ringSizes = [
  { us: "5", uk: "J", eu: "49", diameter: "15.6", circumference: "49.0" },
  { us: "5.5", uk: "K", eu: "50", diameter: "16.0", circumference: "50.2" },
  { us: "6", uk: "L", eu: "51", diameter: "16.4", circumference: "51.5" },
  { us: "6.5", uk: "M", eu: "52", diameter: "16.8", circumference: "52.8" },
  { us: "7", uk: "N", eu: "54", diameter: "17.2", circumference: "54.0" },
  { us: "7.5", uk: "O", eu: "55", diameter: "17.6", circumference: "55.3" },
  { us: "8", uk: "P", eu: "56", diameter: "18.0", circumference: "56.5" },
  { us: "8.5", uk: "Q", eu: "57", diameter: "18.4", circumference: "57.8" },
  { us: "9", uk: "R", eu: "59", diameter: "18.8", circumference: "59.1" },
];
</script>

<PageHeader title="Size Guide" subtitle="Find your perfect fit with our comprehensive sizing guide" />

<ContentSection title="Ring Sizing">
	<div class="space-y-8">
		<div class="bg-muted/10 rounded-lg p-8">
			<h3 class="text-xl font-light text-foreground mb-6">How to Measure Your Ring Size</h3>
			<div class="grid md:grid-cols-2 gap-8">
				<div class="space-y-4">
					<h4 class="font-medium text-foreground">Method 1: Using a Ring You Own</h4>
					<ol class="list-decimal list-inside space-y-2 text-muted-foreground">
						<li>Take a ring that fits comfortably on your desired finger</li>
						<li>Place it on a ruler and measure the inner diameter in millimeters</li>
						<li>Use our size chart below to find your size</li>
					</ol>
				</div>
				<div class="space-y-4">
					<h4 class="font-medium text-foreground">Method 2: Using String or Paper</h4>
					<ol class="list-decimal list-inside space-y-2 text-muted-foreground">
						<li>Wrap string or paper around your finger where the ring will sit</li>
						<li>Mark where the material overlaps</li>
						<li>Measure the length in millimeters</li>
						<li>Divide by 3.14 to get the diameter</li>
					</ol>
				</div>
			</div>
		</div>

		<div class="overflow-x-auto">
			<table class="w-full border-collapse border border-border">
				<thead>
					<tr class="bg-muted/20">
						<th class="border border-border p-3 text-left font-light">US Size</th>
						<th class="border border-border p-3 text-left font-light">UK Size</th>
						<th class="border border-border p-3 text-left font-light">EU Size</th>
						<th class="border border-border p-3 text-left font-light">Diameter (mm)</th>
						<th class="border border-border p-3 text-left font-light">Circumference (mm)</th>
					</tr>
				</thead>
				<tbody>
					{#each ringSizes as size (`${size.us}-${size.uk}-${size.eu}`)}
						<tr class="hover:bg-muted/10">
							<td class="border border-border p-3">{size.us}</td>
							<td class="border border-border p-3">{size.uk}</td>
							<td class="border border-border p-3">{size.eu}</td>
							<td class="border border-border p-3">{size.diameter}</td>
							<td class="border border-border p-3">{size.circumference}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</ContentSection>

<ContentSection title="Bracelet & Necklace Sizing">
	<div class="grid md:grid-cols-2 gap-12">
		<div class="space-y-6">
			<h3 class="text-xl font-light text-foreground">Bracelet Sizes</h3>
			<div class="space-y-4">
				<div class="flex justify-between py-2 border-b border-border">
					<span class="text-muted-foreground">Small</span>
					<span class="text-foreground">6.5" - 7"</span>
				</div>
				<div class="flex justify-between py-2 border-b border-border">
					<span class="text-muted-foreground">Medium</span>
					<span class="text-foreground">7" - 7.5"</span>
				</div>
				<div class="flex justify-between py-2 border-b border-border">
					<span class="text-muted-foreground">Large</span>
					<span class="text-foreground">7.5" - 8"</span>
				</div>
			</div>
		</div>

		<div class="space-y-6">
			<h3 class="text-xl font-light text-foreground">Necklace Lengths</h3>
			<div class="space-y-4">
				<div class="flex justify-between py-2 border-b border-border">
					<span class="text-muted-foreground">Choker</span>
					<span class="text-foreground">14" - 16"</span>
				</div>
				<div class="flex justify-between py-2 border-b border-border">
					<span class="text-muted-foreground">Princess</span>
					<span class="text-foreground">17" - 19"</span>
				</div>
				<div class="flex justify-between py-2 border-b border-border">
					<span class="text-muted-foreground">Matinee</span>
					<span class="text-foreground">20" - 24"</span>
				</div>
				<div class="flex justify-between py-2 border-b border-border">
					<span class="text-muted-foreground">Opera</span>
					<span class="text-foreground">28" - 36"</span>
				</div>
			</div>
		</div>
	</div>
</ContentSection>

<ContentSection title="Need Help?">
	<div class="space-y-6">
		<p class="text-muted-foreground">
			Still unsure about sizing? Our jewelry consultants are here to help you find the perfect
			fit. Download our printable size guide or schedule a virtual consultation.
		</p>
		<div class="flex flex-col sm:flex-row gap-4">
			<button class="px-6 py-2 border border-border text-foreground text-sm font-light hover:bg-muted transition-colors">
				Download PDF Guide
			</button>
			<button class="px-6 py-2 bg-foreground text-background text-sm font-light hover:bg-foreground/90 transition-colors">
				Schedule Consultation
			</button>
		</div>
	</div>
</ContentSection>
