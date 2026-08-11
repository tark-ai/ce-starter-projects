import { FaqAccordion } from "@ce/soja-shared/faq";
import { Layout } from "@/components/Layout";
import { FAQ_ITEMS } from "@/lib/site-content";

const Faq = () => (
  <Layout>
    <FaqAccordion
      items={FAQ_ITEMS}
      title="FAQs"
      subtitle="Everything about shipping, shelf life and using our formulations. If your question isn't here, write to us."
    />
  </Layout>
);

export default Faq;
