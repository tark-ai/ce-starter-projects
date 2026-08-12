import { FaqAccordion } from "@ce/soja-shared/faq";
import { FAQ_ITEMS } from "@/lib/site-content";

export const FAQ_SUBTITLE =
  "Everything about shipping, shelf life and using our formulations. If your question isn't here, write to us.";

export default function FaqContent() {
  return (
    <main>
      <FaqAccordion items={FAQ_ITEMS} title="FAQs" subtitle={FAQ_SUBTITLE} />
    </main>
  );
}
