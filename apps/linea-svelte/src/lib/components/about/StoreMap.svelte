<script lang="ts">
const stores = [
  {
    name: "LINEA Madison Avenue",
    address: "789 Madison Avenue, New York, NY 10065",
  },
  {
    name: "LINEA Beverly Hills",
    address: "456 Rodeo Drive, Beverly Hills, CA 90210",
  },
  {
    name: "LINEA SoHo",
    address: "123 Spring Street, New York, NY 10012",
  },
];
</script>

<div class="w-full h-96 rounded-lg overflow-hidden border border-border bg-muted/10 relative">
	<iframe
		src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12063.046788464958!2d-74.0059413!3d40.7489054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sus!4v1641234567890!5m2!1sen!2sus"
		width="100%"
		height="100%"
		style="border: 0;"
		allowfullscreen
		loading="lazy"
		referrerpolicy="no-referrer-when-downgrade"
		class="w-full h-full"
		title="Store locations map"
	></iframe>

	<div class="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-4 max-w-xs">
		<h4 class="text-sm font-medium text-foreground mb-3">Our Locations</h4>
		<div class="space-y-2">
			{#each stores as store (store.name)}
				<div class="text-xs">
					<div class="flex items-center gap-2 mb-1">
						<div class="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
						<span class="font-medium text-foreground">{store.name}</span>
					</div>
					<p class="text-muted-foreground ml-4">{store.address}</p>
				</div>
			{/each}
		</div>
	</div>
</div>
