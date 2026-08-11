import { ContentSection, PageHeader } from "@ce/soja-shared/about";
import { Layout } from "@/components/Layout";

/**
 * The SOJA reference has no Terms page — this is brand-voiced boilerplate,
 * written for parity with the other two storefronts in the monorepo, which both
 * link to a Terms route from the shared footer.
 */
const TermsOfService = () => (
  <Layout>
    <PageHeader
      title="Terms of Service"
      subtitle="These terms govern your use of the Soja website and the purchase of our products. By placing an order you agree to them."
    />

    <ContentSection title="Orders">
      <p>
        All orders are subject to acceptance and availability. We reserve the right to decline or
        cancel an order, and will refund any payment taken in full where we do so. Prices are shown
        in the currency indicated in the footer and include applicable taxes unless stated
        otherwise.
      </p>
    </ContentSection>

    <ContentSection title="Shipping">
      <p>
        Orders are shipped from Copenhagen. Complimentary international next-day shipping applies to
        orders above the threshold shown on our site. Delivery time frames are estimates and may
        vary with public holidays, courier delays and other circumstances beyond our control.
      </p>
    </ContentSection>

    <ContentSection title="Returns">
      <p>
        Unopened products may be returned within 30 days of delivery for a full refund. For hygiene
        reasons we cannot accept opened skincare products unless they are faulty. Contact us before
        returning anything so we can arrange the return.
      </p>
    </ContentSection>

    <ContentSection title="Product use">
      <p>
        All cosmetic ingredients have the potential to irritate sensitive skin. Our products are
        supplied for external use only and are not intended to diagnose, treat or cure any
        condition. Patch test before first use and discontinue use if irritation occurs.
      </p>
    </ContentSection>

    <ContentSection title="Intellectual property">
      <p>
        All content on this site — including text, imagery, formulations, branding and design — is
        owned by Soja Inc. or its licensors and may not be reproduced without written permission.
      </p>
    </ContentSection>

    <ContentSection title="Contact" className="pb-24">
      <p>
        Questions about these terms can be sent to our team, who will respond within two business
        days.
      </p>
    </ContentSection>
  </Layout>
);

export default TermsOfService;
