import type { Article } from "@ce/little-things-shared/blog";
import { images } from "@ce/little-things-ui/lib/images";

/**
 * Static placeholder blog content. Real editorial copy is pending; this drives
 * both the Home "Latest articles" teaser and the /blog index + post pages.
 */
export const ARTICLES: Article[] = [
  {
    slug: "sustainable-web-design-principles-and-practices",
    title: "Sustainable Web Design Principles and Practices",
    excerpt:
      "Sustainable web design is about creating websites that are environmentally friendly, fast and kind to the planet.",
    author: "Michael Andreuzza",
    date: "April 14, 2025",
    image: images.editorialOne,
    tags: ["web design", "sustainable"],
    body: [
      "Sustainable web design is about creating websites that are environmentally friendly, fast, and kind to the planet. It starts with the boring-but-important stuff: fewer bytes down the wire, smarter caching, and images that aren't secretly 4MB each.",
      "The good news is that the greenest choices are usually the fastest ones too. Trim the fat, lazy-load what nobody sees, and suddenly your carbon footprint and your bounce rate both go down together.",
      "None of this requires a rewrite. Pick one page, measure it, and make it a little lighter this week. Then do it again next week. That's the whole trick.",
    ],
  },
  {
    slug: "the-rise-of-ai-in-web-development",
    title: "The Rise of AI in Web Development",
    excerpt:
      "AI is quietly rewriting how we build for the web — from layout to copy to the boring bits nobody wanted to do.",
    author: "Michael Andreuzza",
    date: "April 10, 2025",
    image: images.editorialTwo,
    tags: ["tech", "web development"],
    body: [
      "AI is quietly rewriting how we build for the web. The obvious wins are code completion and copy drafts, but the sneaky-good ones are the chores: alt text, test scaffolding, and the migration nobody volunteered for.",
      "The teams getting the most out of it treat AI like a fast intern with no context. Give it the boundaries, review the output, and keep the taste in human hands.",
      "The web isn't going to build itself — but it's happy to hand you a very convincing first draft.",
    ],
  },
  {
    slug: "best-practices-for-responsive-web-design",
    title: "Best Practices for Responsive Web Design",
    excerpt:
      "One layout, every screen. Here's how we keep things looking sharp from tiny phones to giant monitors.",
    author: "Michael Andreuzza",
    date: "April 4, 2025",
    image: images.editorialThree,
    tags: ["uiux", "web design"],
    body: [
      "One layout, every screen. Responsive design stopped being a nice-to-have somewhere around the last decade, and yet we still find fixed-width tables lurking in the wild.",
      "Start mobile-first, lean on fluid units, and let CSS grid do the heavy lifting. Breakpoints should follow the content, not a list of popular device widths.",
      "Test on a real phone occasionally. The emulator lies, and your thumbs will thank you.",
    ],
  },
  {
    slug: "small-details-big-difference",
    title: "Small Details, Big Difference",
    excerpt:
      "The little things — micro-interactions, empty states, a well-timed toast — are what make a product feel finished.",
    author: "The Little Things Team",
    date: "March 28, 2025",
    image: images.editorialOne,
    tags: ["uiux", "products"],
    body: [
      "The little things — micro-interactions, empty states, a well-timed toast — are what make a product feel finished. They rarely show up in a spec, and they're always the first thing people notice.",
      "Our rule of thumb: if a moment can either feel abrupt or feel considered, spend the extra ten minutes making it considered.",
      "It adds up. A hundred small kindnesses read as one very polished product.",
    ],
  },
  {
    slug: "designing-for-delight",
    title: "Designing for Delight Without the Gimmicks",
    excerpt:
      "Delight isn't confetti on every click. It's the feeling that someone thought about you before you arrived.",
    author: "The Little Things Team",
    date: "March 20, 2025",
    image: images.editorialTwo,
    tags: ["uiux", "personalization"],
    body: [
      "Delight isn't confetti on every click. It's the feeling that someone thought about you before you arrived — sensible defaults, copy that sounds human, and nothing that makes you feel stupid.",
      "Restraint is the secret ingredient. The best surprises are the ones that get out of the way once they've done their job.",
      "Design for the person having a bad day. Everyone else comes along for free.",
    ],
  },
  {
    slug: "the-case-for-fewer-features",
    title: "The Case for Fewer Features",
    excerpt:
      "Every feature you add is a feature you have to explain, maintain, and defend. Sometimes the best roadmap is a delete key.",
    author: "The Little Things Team",
    date: "March 12, 2025",
    image: images.editorialThree,
    tags: ["products", "productivity"],
    body: [
      "Every feature you add is a feature you have to explain, maintain, and defend. Sometimes the best roadmap is a delete key and the courage to use it.",
      "Focus is a product decision, not a personality trait. Say no often enough and the yeses start to mean something.",
      "A small product that does one thing beautifully will always outlast a big one that does ten things nervously.",
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

export function getRelatedArticles(slug: string, limit = 3): Article[] {
  return ARTICLES.filter((article) => article.slug !== slug).slice(0, limit);
}
