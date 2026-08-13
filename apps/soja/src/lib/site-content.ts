import type { FaqItem } from "@ce/soja-shared/faq";

export const SITE_NAME = "Soja";
export const SITE_URL = "https://soja.demo.commercengine.io";

export const HOME_COPY = {
  hero: {
    title: "Rituals of natural skincare",
    body: "Experience the ritual of SOJA skincare. Our award-winning bioformulations are hand-crafted and balanced with ethically-sourced ingredients from our laboratory in Scandinavia.",
    cta: "Shop the collection",
  },
  featured: {
    lede: "Elevated skincare powered by natural remedies and made with artisanal care. Balanced and restorative treatments.",
  },
  popular: {
    lede: "Our most popular formulations. Renowned for their luxurious sensation on skin and organic formulas.",
  },
  testimonial: {
    quote:
      "I've tried a lot of facial serums over the years, but matcha tea serum was by far the gentlest on my skin with a calming and restorative effect. I'm obsessed.",
    author: "Theresa Young · 42",
    productSlug: "organic-kelp-anti-ageing-serum",
  },
} as const;

export const SHOP_CATEGORIES = [
  { label: "Skin care", slug: "skin-care" },
  { label: "Hand and body", slug: "hand-and-body" },
  { label: "Hair", slug: "hair" },
] as const;

export const PLP_COPY = {
  title: "All products",
  subtitle:
    "Our most popular formulations. Renowned for their luxurious sensation on skin and organic formulas.",
} as const;

export const ABOUT_COPY = {
  title: "Behind the brand",
  subtitle:
    "Elevated skincare powered by natural remedies and made with artisanal care. Balanced and restorative treatments.",
  whoWeAre: {
    title: "Who we are",
    content:
      "Founded in 2016 by award-winning cosmetic scientist Lisa Kim, SOJA is an independently owned brand committed to providing the best quality skincare products for everyone.",
  },
  ourValues: {
    title: "Our values",
    content:
      "We believe that the best products start with the best ingredients. That's why we take pride in sourcing 100% organic and ethical ingredients for every single one of our batches. We hand craft all our formulas in Copenhagen, Denmark.",
  },
} as const;

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What are your shipping options?",
    answer:
      "All orders are shipped from Copenhagen. Orders placed after 12pm on a Friday, or the weekend, will be processed the following business day. Business days include Monday to Friday, excluding Public Holidays. Our delivery time frames are estimates only and may vary with public holidays, possible courier delivery issues, and other influences (such as severe weather conditions) that are beyond the control of SOJA.",
  },
  {
    question: "Do SOJA products have an expiry date?",
    answer:
      "Generally speaking, and unless a shorter expiry date is printed on the product, SOJA products have a recommended shelf life of at least 36 months after manufacture with additional time as specified in the period after opening.",
  },
  {
    question: "What if I have an adverse reaction to a SOJA product?",
    answer:
      "All cosmetic ingredients have the potential to irritate sensitive skin regardless of the amount present in an individual product or the method in which it is used. Irritations can sometimes occur in the regular course of our daily lives, even where we have used and enjoyed a product successfully for many years.",
  },
  {
    question: "Are SOJA products safe to use during a pregnancy?",
    answer:
      "We understand that many women seek alternatives to botanically rich products during pregnancy; however, to our knowledge there is no risk associated with using any SOJA formulation in the manner we recommend during pregnancy.",
  },
];
