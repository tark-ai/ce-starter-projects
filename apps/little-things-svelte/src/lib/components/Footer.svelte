<script lang="ts">
import type { LittleThingsRoute } from "$lib/little-things-routing";
import { routeToHref } from "$lib/little-things-routing";
import Logo from "./Logo.svelte";

interface FooterColumn {
  heading: string;
  links: Array<{ label: string; route: LittleThingsRoute }>;
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Store",
    links: [
      { label: "All products", route: { path: "/all-products" } },
      { label: "Membership", route: { path: "/about" } },
      { label: "Affiliates", route: { path: "/about" } },
    ],
  },
  {
    heading: "Navigation",
    links: [
      { label: "Blog", route: { path: "/blog" } },
      { label: "About", route: { path: "/about" } },
      { label: "Contact", route: { path: "/about" } },
      { label: "Helpcenter home", route: { path: "/about" } },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Overview", route: { path: "/about" } },
      { label: "Terms of Service", route: { path: "/legal/terms" } },
      { label: "Privacy Policy", route: { path: "/legal/privacy" } },
      { label: "Documentation", route: { path: "/about" } },
    ],
  },
];

const year = new Date().getFullYear();
</script>

<footer class="relative w-full overflow-hidden border-t border-border bg-background text-foreground">
	<div class="relative z-10 mx-auto max-w-[1400px] px-6 py-16 lg:px-20">
		<div class="grid grid-cols-2 gap-10 md:grid-cols-4">
			<div class="col-span-2 flex items-center gap-3 md:col-span-1 md:block">
				<a href={routeToHref({ path: '/' })} class="inline-flex">
					<Logo class="h-5 w-5 text-foreground" />
				</a>
				<p class="text-sm text-muted-foreground md:mt-3">
					© Copyright Little Things {year}
				</p>
			</div>

			{#each FOOTER_COLUMNS as column (column.heading)}
				<div>
					<p class="mb-4 font-display text-2xl italic text-foreground">{column.heading}</p>
					<ul class="space-y-2.5">
						{#each column.links as link (link.label)}
							<li>
								<a
									href={routeToHref(link.route)}
									class="text-sm text-muted-foreground transition-colors hover:text-foreground"
								>
									{link.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>

	<!-- Oversized faint wordmark watermark -->
	<div
		aria-hidden="true"
		class="pointer-events-none select-none overflow-hidden whitespace-nowrap px-6 pb-0 text-center font-display text-[22vw] italic leading-[0.75] text-foreground/15"
	>
		Little Things
	</div>
</footer>
