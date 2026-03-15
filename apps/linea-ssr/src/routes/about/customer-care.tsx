import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ce/ui/components/ui/accordion";
import { Button } from "@ce/ui/components/ui/button";
import { Input } from "@ce/ui/components/ui/input";
import { Textarea } from "@ce/ui/components/ui/textarea";
import { createFileRoute } from "@tanstack/react-router";
import AboutSidebar from "@/components/about/AboutSidebar";
import ContentSection from "@/components/about/ContentSection";
import PageHeader from "@/components/about/PageHeader";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";

const SITE_URL = "https://linea-static.demo.commercengine.io";
const SITE_NAME = "Linea";

export const Route = createFileRoute("/about/customer-care")({
  head: () => ({
    meta: [
      {
        title: `Customer Care | ${SITE_NAME}`,
      },
      {
        name: "description",
        content:
          "Get help with your Linea jewelry needs — contact information, FAQs, shipping, returns, warranty, and more.",
      },
      {
        property: "og:title",
        content: `Customer Care | ${SITE_NAME}`,
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/about/customer-care` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/about/customer-care` }],
  }),
  component: CustomerCarePage,
});

function CustomerCarePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="flex">
        <div className="hidden lg:block">
          <AboutSidebar />
        </div>

        <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
          <PageHeader
            title="Customer Care"
            subtitle="We're here to help you with all your jewelry needs"
          />

          <ContentSection title="Contact Information">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Phone</h3>
                <p className="text-muted-foreground">+1 (555) 123-4567</p>
                <p className="text-sm text-muted-foreground">
                  Mon-Fri: 9AM-6PM EST
                  <br />
                  Sat: 10AM-4PM EST
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Email</h3>
                <p className="text-muted-foreground">care@lineajewelry.com</p>
                <p className="text-sm text-muted-foreground">Response within 24 hours</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Live Chat</h3>
                <Button variant="outline" className="rounded-none">
                  Start Chat
                </Button>
                <p className="text-sm text-muted-foreground">Available during business hours</p>
              </div>
            </div>
          </ContentSection>

          <ContentSection title="Frequently Asked Questions">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="shipping" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  What are your shipping options and timeframes?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  We offer free standard shipping (3-5 business days) on orders over $500. Express
                  shipping (1-2 business days) is available for $25. All orders are fully insured
                  and require signature confirmation.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="returns" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  What is your return and exchange policy?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  We offer a 30-day return policy for unworn items in original condition. Custom and
                  engraved pieces are final sale. Returns are free with our prepaid return label.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="warranty" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  What warranty do you offer on your jewelry?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  All LINEA jewelry comes with a lifetime warranty against manufacturing defects.
                  This includes free repairs for normal wear and tear, stone tightening, and
                  professional cleaning.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="sizing" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  Can I resize my jewelry after purchase?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes, we offer free ring resizing within 60 days of purchase (up to 2 sizes).
                  Additional resizing is available for a service fee. Some designs cannot be resized
                  due to their construction.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="care" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  How should I care for my LINEA jewelry?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Store pieces separately in soft pouches, avoid contact with chemicals and
                  cosmetics, and clean gently with a soft cloth. We recommend professional cleaning
                  every 6-12 months.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="authentication"
                className="border border-border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  How can I verify the authenticity of my jewelry?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Every LINEA piece comes with a certificate of authenticity and is hallmarked. You
                  can verify authenticity on our website using your unique piece number or contact
                  our customer care team.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </ContentSection>

          <ContentSection title="Contact Form">
            <div>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="first-name" className="text-sm font-light text-foreground">
                      First Name
                    </label>
                    <Input
                      id="first-name"
                      className="rounded-none"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="last-name" className="text-sm font-light text-foreground">
                      Last Name
                    </label>
                    <Input
                      id="last-name"
                      className="rounded-none"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-light text-foreground">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    className="rounded-none"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="order-number" className="text-sm font-light text-foreground">
                    Order Number (Optional)
                  </label>
                  <Input
                    id="order-number"
                    className="rounded-none"
                    placeholder="Enter your order number if applicable"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="inquiry" className="text-sm font-light text-foreground">
                    How can we help you?
                  </label>
                  <Textarea
                    id="inquiry"
                    className="rounded-none min-h-[120px]"
                    placeholder="Please describe your inquiry in detail"
                  />
                </div>

                <Button type="submit" className="w-full rounded-none">
                  Send Message
                </Button>
              </form>
            </div>
          </ContentSection>
        </main>
      </div>

      <Footer />
    </div>
  );
}
