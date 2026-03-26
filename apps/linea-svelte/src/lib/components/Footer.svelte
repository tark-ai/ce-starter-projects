<script lang="ts">
const shopLinks = [
  { href: "/category/new-in", label: "New In" },
  { href: "/category/rings", label: "Rings" },
  { href: "/category/earrings", label: "Earrings" },
  { href: "/category/bracelets", label: "Bracelets" },
  { href: "/category/necklaces", label: "Necklaces" },
];

const supportLinks = [
  { href: "/about/size-guide", label: "Size Guide" },
  { href: "/about/customer-care", label: "Care Instructions" },
  { href: "/about/customer-care", label: "Returns" },
  { href: "/about/customer-care", label: "Shipping" },
  { href: "/about/customer-care", label: "Contact" },
];
</script>

<footer class="w-full bg-white text-black pt-8 pb-2 px-6 border-t border-border mt-48">
	<div>
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
			<!-- Brand - Left side -->
			<div>
				<img src="/LINEA-1.svg" alt="Linea Jewelry Inc." class="mb-4 h-6 w-auto" />
				<p class="text-sm font-light text-black/70 leading-relaxed max-w-md mb-6">
					Minimalist jewelry crafted for the modern individual
				</p>

				<!-- Contact Information -->
				<div class="space-y-2 text-sm font-light text-black/70">
					<div>
						<p class="font-normal text-black mb-1">Visit Us</p>
						<p>123 Madison Avenue</p>
						<p>New York, NY 10016</p>
					</div>
					<div>
						<p class="font-normal text-black mb-1 mt-3">Contact</p>
						<p>+1 (212) 555-0123</p>
						<p>hello@lineajewelry.com</p>
					</div>
				</div>
			</div>

			<!-- Link lists - Right side -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
				<!-- Shop -->
				<div>
					<p class="text-sm font-normal mb-4">Shop</p>
					<ul class="space-y-2">
						{#each shopLinks as { href, label } (label)}
							<li>
								<a
									{href}
									class="text-sm font-light text-black/70 hover:text-black transition-colors"
								>
									{label}
								</a>
							</li>
						{/each}
					</ul>
				</div>

				<!-- Support -->
				<div>
					<p class="text-sm font-normal mb-4">Support</p>
					<ul class="space-y-2">
						{#each supportLinks as { href, label } (label)}
							<li>
								<a
									{href}
									class="text-sm font-light text-black/70 hover:text-black transition-colors"
								>
									{label}
								</a>
							</li>
						{/each}
					</ul>
				</div>

				<!-- Connect -->
				<div>
					<p class="text-sm font-normal mb-4">Connect</p>
					<ul class="space-y-2">
						<li>
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								class="text-sm font-light text-black/70 hover:text-black transition-colors"
							>
								Instagram
							</a>
						</li>
						<li>
							<a
								href="https://pinterest.com"
								target="_blank"
								rel="noopener noreferrer"
								class="text-sm font-light text-black/70 hover:text-black transition-colors"
							>
								Pinterest
							</a>
						</li>
						<li>
							<a
								href="/about/customer-care"
								class="text-sm font-light text-black/70 hover:text-black transition-colors"
							>
								Newsletter
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>

	<!-- Bottom section - edge to edge separator -->
	<div class="border-t border-border -mx-6 px-6 pt-2">
		<div class="flex flex-col md:flex-row justify-between items-center">
			<p class="text-sm font-light text-black mb-1 md:mb-0">
				MIT Licensed. A
				<a
					href="https://www.commercengine.io"
					target="_blank"
					rel="noopener noreferrer"
					class="hover:text-black/70 transition-colors underline"
				>
					Commerce Engine
				</a>
				starter built on a template by Rickard Liljeros
			</p>
			<div class="flex space-x-6">
				<a
					href="/privacy-policy"
					class="text-sm font-light text-black hover:text-black/70 transition-colors"
				>
					Privacy Policy
				</a>
				<a
					href="/terms-of-service"
					class="text-sm font-light text-black hover:text-black/70 transition-colors"
				>
					Terms of Service
				</a>
			</div>
		</div>
	</div>
</footer>
