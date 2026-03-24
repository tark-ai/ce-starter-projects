<script lang="ts">
import { SITE_URL } from "$lib/seo";
import ContentSection from "$lib/components/about/ContentSection.svelte";
import PageHeader from "$lib/components/about/PageHeader.svelte";

const faqs = [
  {
    id: "shipping",
    question: "What are your shipping options and timeframes?",
    answer:
      "We offer free standard shipping (3-5 business days) on orders over $500. Express shipping (1-2 business days) is available for $25. All orders are fully insured and require signature confirmation.",
  },
  {
    id: "returns",
    question: "What is your return and exchange policy?",
    answer:
      "We offer a 30-day return policy for unworn items in original condition. Custom and engraved pieces are final sale. Returns are free with our prepaid return label.",
  },
  {
    id: "warranty",
    question: "What warranty do you offer on your jewelry?",
    answer:
      "All LINEA jewelry comes with a lifetime warranty against manufacturing defects. This includes free repairs for normal wear and tear, stone tightening, and professional cleaning.",
  },
  {
    id: "sizing",
    question: "Can I resize my jewelry after purchase?",
    answer:
      "Yes, we offer free ring resizing within 60 days of purchase (up to 2 sizes). Additional resizing is available for a service fee. Some designs cannot be resized due to their construction.",
  },
  {
    id: "care",
    question: "How should I care for my LINEA jewelry?",
    answer:
      "Store pieces separately in soft pouches, avoid contact with chemicals and cosmetics, and clean gently with a soft cloth. We recommend professional cleaning every 6-12 months.",
  },
  {
    id: "authentication",
    question: "How can I verify the authenticity of my jewelry?",
    answer:
      "Every LINEA piece comes with a certificate of authenticity and is hallmarked. You can verify authenticity on our website using your unique piece number or contact our customer care team.",
  },
];

let openFaq = $state<string | null>(null);

function toggleFaq(id: string) {
  openFaq = openFaq === id ? null : id;
}
</script>

<svelte:head>
	<title>Customer Care | Linea</title>
	<meta name="description" content="Get help with orders, shipping, returns, and product care. Linea's customer care team is here for you." />
	<link rel="canonical" href="{SITE_URL}/about/customer-care" />
</svelte:head>

<PageHeader title="Customer Care" subtitle="We're here to help you with all your jewelry needs" />

<ContentSection title="Contact Information">
	<div class="grid md:grid-cols-3 gap-8">
		<div class="space-y-4">
			<h3 class="text-lg font-light text-foreground">Phone</h3>
			<p class="text-muted-foreground">+1 (555) 123-4567</p>
			<p class="text-sm text-muted-foreground">
				Mon-Fri: 9AM-6PM EST<br />
				Sat: 10AM-4PM EST
			</p>
		</div>
		<div class="space-y-4">
			<h3 class="text-lg font-light text-foreground">Email</h3>
			<p class="text-muted-foreground">care@lineajewelry.com</p>
			<p class="text-sm text-muted-foreground">Response within 24 hours</p>
		</div>
		<div class="space-y-4">
			<h3 class="text-lg font-light text-foreground">Live Chat</h3>
			<button class="px-6 py-2 border border-border text-foreground text-sm font-light hover:bg-muted transition-colors">
				Start Chat
			</button>
			<p class="text-sm text-muted-foreground">Available during business hours</p>
		</div>
	</div>
</ContentSection>

<ContentSection title="Frequently Asked Questions">
	<div class="space-y-4">
		{#each faqs as faq (faq.id)}
			<div class="border border-border rounded-lg px-6">
				<button
					onclick={() => toggleFaq(faq.id)}
					class="w-full flex items-center justify-between py-4 text-left hover:no-underline"
				>
					<span class="text-foreground">{faq.question}</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-4 h-4 text-muted-foreground transition-transform {openFaq === faq.id
							? 'rotate-180'
							: ''}"
						role="img"
						aria-label="Toggle"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m19.5 8.25-7.5 7.5-7.5-7.5"
						/>
					</svg>
				</button>
				{#if openFaq === faq.id}
					<div class="pb-4 text-muted-foreground">
						{faq.answer}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</ContentSection>

<ContentSection title="Contact Form">
	<form class="space-y-6">
		<div class="grid md:grid-cols-2 gap-6">
			<div class="space-y-2">
				<label for="first-name" class="text-sm font-light text-foreground">First Name</label>
				<input
					id="first-name"
					class="w-full border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
					placeholder="Enter your first name"
				/>
			</div>
			<div class="space-y-2">
				<label for="last-name" class="text-sm font-light text-foreground">Last Name</label>
				<input
					id="last-name"
					class="w-full border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
					placeholder="Enter your last name"
				/>
			</div>
		</div>

		<div class="space-y-2">
			<label for="email" class="text-sm font-light text-foreground">Email</label>
			<input
				id="email"
				type="email"
				class="w-full border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
				placeholder="Enter your email"
			/>
		</div>

		<div class="space-y-2">
			<label for="order-number" class="text-sm font-light text-foreground">
				Order Number (Optional)
			</label>
			<input
				id="order-number"
				class="w-full border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
				placeholder="Enter your order number if applicable"
			/>
		</div>

		<div class="space-y-2">
			<label for="inquiry" class="text-sm font-light text-foreground">How can we help you?</label>
			<textarea
				id="inquiry"
				class="w-full border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring min-h-[120px]"
				placeholder="Please describe your inquiry in detail"
			></textarea>
		</div>

		<button
			type="submit"
			class="w-full px-6 py-2 bg-foreground text-background text-sm font-light hover:bg-foreground/90 transition-colors"
		>
			Send Message
		</button>
	</form>
</ContentSection>
