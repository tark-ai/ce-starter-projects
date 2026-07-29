<script lang="ts">
import ContentSection from "$lib/components/about/ContentSection.svelte";
import PageHeader from "$lib/components/about/PageHeader.svelte";
</script>

<PageHeader
	title="Privacy Policy"
	subtitle="Last updated: July 27, 2026. The short version: we collect only what we need to run the shop, we don't sell your data, and you can ask us to delete it."
/>

<ContentSection title="Introduction">
	{#snippet children()}
		<p>
			Little Things ("we," "our," or "us") respects your privacy and is committed to protecting
			your personal data. This policy explains what we collect, how we use it, and the choices you
			have when you browse, buy, or get in touch.
		</p>
	{/snippet}
</ContentSection>

<ContentSection title="Information we collect">
	{#snippet children()}
		<p>
			We collect information you give us directly — your name, email, shipping and billing
			addresses, and order details. Payment information is handled securely by our payment providers
			and never stored on our servers.
		</p>
		<p>
			We also collect basic usage data automatically, such as your device type, browser, and the
			pages you visit, so we can keep the site fast and fix what's broken.
		</p>
	{/snippet}
</ContentSection>

<ContentSection title="How we use your information">
	{#snippet children()}
		<ul class="list-disc space-y-1 pl-5">
			<li>Processing and shipping your orders</li>
			<li>Answering your questions and providing support</li>
			<li>Sending updates and offers (only if you opted in)</li>
			<li>Improving the site and preventing fraud</li>
			<li>Meeting our legal obligations</li>
		</ul>
	{/snippet}
</ContentSection>

<ContentSection title="Your rights and choices">
	{#snippet children()}
		<p>
			Depending on where you live, you may have the right to access, correct, or delete your
			personal information, object to certain processing, or withdraw consent. To exercise any of
			these, email us at privacy@littlethings.example and we'll take it from there.
		</p>
	{/snippet}
</ContentSection>

<ContentSection title="Contact us">
	{#snippet children()}
		<p>
			Questions about this policy? Reach us at privacy@littlethings.example. We read every message,
			we promise.
		</p>
	{/snippet}
</ContentSection>
