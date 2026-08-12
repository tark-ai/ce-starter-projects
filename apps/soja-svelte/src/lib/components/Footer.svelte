<script lang="ts">
import { images } from "@ce/soja-ui/lib/images";
import Logo from "./Logo.svelte";

const SITE_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/all-products" },
  { label: "Our story", href: "/about" },
  { label: "FAQs", href: "/faq" },
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Terms of service", href: "/terms-of-service" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Twitter", href: "https://x.com" },
  { label: "YouTube", href: "https://www.youtube.com" },
  { label: "TikTok", href: "https://tiktok.com" },
];

interface Props {
  locale?: string;
  /** Resolve to confirm the signup; reject to surface the error state. */
  onsubscribe?: (email: string) => void | Promise<void>;
}

type SubscribeStatus = "idle" | "submitting" | "done" | "error" | "unavailable";

let { locale = "Denmark / DKK", onsubscribe }: Props = $props();

let email = $state("");
let status = $state<SubscribeStatus>("idle");

async function subscribe(event: SubmitEvent) {
  event.preventDefault();
  const trimmed = email.trim();
  if (!trimmed || status === "submitting") return;

  // No handler means nothing is stored, so don't promise an email that won't arrive.
  if (!onsubscribe) {
    status = "unavailable";
    return;
  }

  status = "submitting";
  try {
    await onsubscribe(trimmed);
    status = "done";
    email = "";
  } catch {
    status = "error";
  }
}

const year = new Date().getFullYear();
</script>

<footer class="relative overflow-hidden bg-neutral-800 text-white">
	<img
		src={images.footer}
		alt=""
		aria-hidden="true"
		loading="lazy"
		decoding="async"
		class="absolute inset-0 h-full w-full object-cover"
	/>

	<div class="soja-container relative grid gap-14 py-20 tablet:grid-cols-3 tablet:gap-8 tablet:py-28">
		<div class="flex flex-col items-start gap-8">
			<Logo class="h-6" />

			<div class="flex flex-col gap-4">
				<p class="max-w-[300px] text-meta">Join our club and get 10% off your first purchase</p>

				{#if status === "done"}
					<p class="text-meta text-white/70">Thank you — check your inbox.</p>
				{:else if status === "unavailable"}
					<p class="text-meta text-white/70">
						Newsletter signup isn't connected on this storefront yet.
					</p>
				{:else}
					<form onsubmit={subscribe} class="flex max-w-[320px]">
						<input
							type="email"
							required
							bind:value={email}
							placeholder="Your email"
							aria-label="Email address"
							class="h-11 min-w-0 flex-1 bg-white px-3 text-meta text-foreground outline-none placeholder:text-muted-foreground"
						/>
						<button
							type="submit"
							class="h-11 shrink-0 bg-neutral-900 px-5 text-meta text-white transition-opacity duration-300 ease-soja hover:opacity-80"
						>
							Join
						</button>
					</form>
				{/if}
			</div>
		</div>

		<nav class="flex flex-col gap-3">
			{#each SITE_LINKS as link (link.href)}
				<a
					href={link.href}
					class="w-fit text-meta transition-opacity duration-300 ease-soja hover:opacity-60"
				>
					{link.label}
				</a>
			{/each}

			<div class="mt-14 flex flex-col gap-1 text-meta text-white/60">
				<span>{locale}</span>
				<span>Copyright © {year} Soja Inc. All rights reserved</span>
			</div>
		</nav>

		<nav class="flex flex-col gap-3">
			{#each SOCIAL_LINKS as link (link.href)}
				<a
					href={link.href}
					target="_blank"
					rel="noopener noreferrer"
					class="w-fit text-meta transition-opacity duration-300 ease-soja hover:opacity-60"
				>
					{link.label}
				</a>
			{/each}
		</nav>
	</div>
</footer>
