import ContentSection from "@/components/about/ContentSection";
import PageHeader from "@/components/about/PageHeader";

export function PrivacyPolicyView() {
  return (
    <main>
      <PageHeader
        title="Privacy Policy"
        subtitle="Last updated: July 27, 2026. The short version: we collect only what we need to run the shop, we don't sell your data, and you can ask us to delete it."
      />

      <ContentSection title="Introduction">
        <p>
          Little Things ("we," "our," or "us") respects your privacy and is committed to protecting
          your personal data. This policy explains what we collect, how we use it, and the choices
          you have when you browse, buy, or get in touch.
        </p>
      </ContentSection>

      <ContentSection title="Information we collect">
        <p>
          We collect information you give us directly — your name, email, shipping and billing
          addresses, and order details. Payment information is handled securely by our payment
          providers and never stored on our servers.
        </p>
        <p>
          We also collect basic usage data automatically, such as your device type, browser, and the
          pages you visit, so we can keep the site fast and fix what's broken.
        </p>
      </ContentSection>

      <ContentSection title="How we use your information">
        <ul className="list-disc space-y-1 pl-5">
          <li>Processing and shipping your orders</li>
          <li>Answering your questions and providing support</li>
          <li>Sending updates and offers (only if you opted in)</li>
          <li>Improving the site and preventing fraud</li>
          <li>Meeting our legal obligations</li>
        </ul>
      </ContentSection>

      <ContentSection title="Your rights and choices">
        <p>
          Depending on where you live, you may have the right to access, correct, or delete your
          personal information, object to certain processing, or withdraw consent. To exercise any
          of these, email us at privacy@littlethings.example and we'll take it from there.
        </p>
      </ContentSection>

      <ContentSection title="Contact us">
        <p>
          Questions about this policy? Reach us at privacy@littlethings.example. We read every
          message, we promise.
        </p>
      </ContentSection>
    </main>
  );
}
