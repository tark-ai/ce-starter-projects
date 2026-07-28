import ContentSection from "@/components/about/ContentSection";
import PageHeader from "@/components/about/PageHeader";

export function TermsView() {
  return (
    <main>
      <PageHeader
        title="Terms of Service"
        subtitle="Last updated: July 27, 2026. By using Little Things you agree to these terms. They're the usual sensible stuff — please give them a read."
      />

      <ContentSection title="Agreement to terms">
        <p>
          By accessing or using the Little Things website and services, you agree to be bound by
          these Terms of Service. If you don't agree with any part of them, please don't use the
          site.
        </p>
      </ContentSection>

      <ContentSection title="Using our store">
        <p>
          You may browse and purchase products for personal, non-commercial use. You agree not to
          misuse the site, interfere with its operation, or attempt to access it in ways we haven't
          intended.
        </p>
      </ContentSection>

      <ContentSection title="Orders and pricing">
        <p>
          We do our best to keep prices, descriptions, and availability accurate. Occasionally
          mistakes happen; if we find an error with an order you've placed, we'll contact you and
          give you the option to continue or cancel.
        </p>
      </ContentSection>

      <ContentSection title="Returns and refunds">
        <p>
          Most items can be returned within 30 days in their original condition. Refunds are issued
          to your original payment method once we've received and checked the return. Some items may
          be excluded — we'll always say so on the product page.
        </p>
      </ContentSection>

      <ContentSection title="Limitation of liability">
        <p>
          The site and its content are provided "as is." To the fullest extent permitted by law,
          Little Things isn't liable for any indirect or incidental damages arising from your use of
          the site.
        </p>
      </ContentSection>

      <ContentSection title="Contact us">
        <p>
          Questions about these terms? Email us at support@littlethings.example and we'll help you
          out.
        </p>
      </ContentSection>
    </main>
  );
}
