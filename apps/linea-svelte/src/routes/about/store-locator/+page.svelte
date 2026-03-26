<script lang="ts">
import { SITE_NAME, SITE_URL } from "$lib/seo";
import ContentSection from "$lib/components/about/ContentSection.svelte";
import PageHeader from "$lib/components/about/PageHeader.svelte";
import StoreMap from "$lib/components/about/StoreMap.svelte";

const title = `Store Locator | ${SITE_NAME}`;
const description = "Find a LINEA jewelry store near you. Visit our boutiques for a personalized shopping experience.";
const url = `${SITE_URL}/about/store-locator`;

const stores = [
  {
    name: "LINEA Madison Avenue",
    address: "789 Madison Avenue, New York, NY 10065",
    phone: "+1 (212) 555-0123",
    hours: "Mon-Sat: 10AM-8PM, Sun: 12PM-6PM",
    services: ["Personal Shopping", "Custom Design", "Repairs", "Appraisals"],
  },
  {
    name: "LINEA Beverly Hills",
    address: "456 Rodeo Drive, Beverly Hills, CA 90210",
    phone: "+1 (310) 555-0456",
    hours: "Mon-Sat: 10AM-8PM, Sun: 12PM-6PM",
    services: ["Personal Shopping", "Custom Design", "VIP Suites", "Repairs"],
  },
  {
    name: "LINEA SoHo",
    address: "123 Spring Street, New York, NY 10012",
    phone: "+1 (212) 555-0789",
    hours: "Mon-Sat: 11AM-8PM, Sun: 12PM-7PM",
    services: ["Browse & Buy", "Repairs", "Gift Wrapping"],
  },
];
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
	title="Store Locator"
	subtitle="Visit us in person for a personalized jewelry experience"
/>

<ContentSection title="Interactive Store Map">
	<StoreMap />
</ContentSection>

<ContentSection title="Our Locations">
	<div class="grid gap-8">
		{#each stores as store (store.name)}
			<div class="bg-background rounded-lg p-8 border border-border">
				<div class="grid md:grid-cols-2 gap-8">
					<div class="space-y-4">
						<h3 class="text-xl font-light text-foreground">{store.name}</h3>
						<div class="space-y-2 text-muted-foreground">
							<p>{store.address}</p>
							<p>{store.phone}</p>
							<p>{store.hours}</p>
						</div>

						<div class="flex flex-col sm:flex-row gap-3 pt-4">
							<button type="button" class="px-6 py-2 border border-border text-foreground text-sm font-light hover:bg-muted transition-colors">
								Get Directions
							</button>
							<button type="button" class="px-6 py-2 bg-foreground text-background text-sm font-light hover:bg-foreground/90 transition-colors">
								Book Appointment
							</button>
						</div>
					</div>

					<div class="space-y-4">
						<h4 class="text-lg font-light text-foreground">Available Services</h4>
						<ul class="grid grid-cols-2 gap-2">
							{#each store.services as service (service)}
								<li class="text-sm text-muted-foreground flex items-center">
									<span class="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
									{service}
								</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>
		{/each}
	</div>
</ContentSection>

<ContentSection title="Private Appointments">
	<div class="space-y-6">
		<p class="text-lg text-muted-foreground leading-relaxed">
			Experience personalized service with a private appointment. Our jewelry consultants will
			guide you through our collections, help with custom designs, and provide expert advice in a
			comfortable, private setting.
		</p>

		<div class="grid md:grid-cols-3 gap-8 mt-12">
			<div class="space-y-3">
				<h4 class="text-lg font-light text-foreground">Personal Shopping</h4>
				<p class="text-muted-foreground text-sm">
					One-on-one guidance to find the perfect piece for any occasion
				</p>
			</div>
			<div class="space-y-3">
				<h4 class="text-lg font-light text-foreground">Custom Design</h4>
				<p class="text-muted-foreground text-sm">
					Work with our designers to create a unique piece just for you
				</p>
			</div>
			<div class="space-y-3">
				<h4 class="text-lg font-light text-foreground">Expert Services</h4>
				<p class="text-muted-foreground text-sm">
					Professional appraisals, repairs, and maintenance services
				</p>
			</div>
		</div>

		<div class="pt-8">
			<button type="button" class="px-8 py-3 bg-foreground text-background text-sm font-light hover:bg-foreground/90 transition-colors">
				Schedule Your Appointment
			</button>
		</div>
	</div>
</ContentSection>

<ContentSection title="Virtual Consultations">
	<div class="bg-muted/10 rounded-lg p-8">
		<h3 class="text-xl font-light text-foreground mb-4">Can't visit in person?</h3>
		<p class="text-muted-foreground mb-6">
			Book a virtual consultation with one of our jewelry experts. We'll showcase pieces via
			video call, answer your questions, and help you make the perfect selection from the comfort
			of your home.
		</p>
		<button type="button" class="px-6 py-2 border border-border text-foreground text-sm font-light hover:bg-muted transition-colors">
			Book Virtual Consultation
		</button>
	</div>
</ContentSection>
