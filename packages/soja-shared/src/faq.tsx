import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ce/soja-ui/components/ui/accordion";
import { Reveal } from "./content";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqAccordionProps {
  items: FaqItem[];
  title?: string;
  subtitle?: string;
}

export function FaqAccordion({ items, title = "FAQs", subtitle }: FaqAccordionProps) {
  return (
    <div className="soja-container py-16 tablet:py-24">
      <Reveal>
        <h1 className="font-display text-[2rem] tracking-display tablet:text-display">{title}</h1>
      </Reveal>

      {subtitle && (
        <Reveal delay={90}>
          <p className="mt-6 max-w-[600px] text-meta leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        </Reveal>
      )}

      <Reveal delay={160}>
        <Accordion type="single" collapsible className="mt-16 max-w-[840px] border-t border-border">
          {items.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </div>
  );
}
