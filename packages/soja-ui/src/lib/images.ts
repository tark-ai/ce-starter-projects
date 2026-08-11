import footerBg from "../assets/footer-bg.avif";
import heroImage from "../assets/hero.avif";
import shopHairBody from "../assets/shop-hair-body.avif";
import shopSkincare from "../assets/shop-skincare.avif";
import testimonialBg from "../assets/testimonial.avif";

const seed = (name: string, w: number, h: number) =>
  `https://picsum.photos/seed/soja-${name}/${w}/${h}`;

export const IMAGEKIT_ENDPOINT = "https://images.tarkai.com";

/** Shipped assets, with Picsum seeds standing in until the rest of the shoot lands. */
export const images = {
  hero: heroImage,
  footer: footerBg,
  testimonial: testimonialBg,

  /** Brand-pillar column images (2:3 portrait). Pillar III is black & white. */
  pillarShipping: seed("pillar-shipping", 800, 1200),
  pillarPackaging: seed("pillar-packaging", 800, 1200),
  pillarCopenhagen: `${seed("pillar-copenhagen", 800, 1200)}?grayscale`,
  pillarSourcing: seed("pillar-sourcing", 800, 1200),

  /** Homepage category tiles (2:3 portrait). */
  shopSkincare,
  shopHairBody,

  hair: seed("hair", 900, 1350),
  storyFounder: seed("story-founder", 1200, 900),
  storyLab: seed("story-lab", 1200, 900),
} as const;

export type SojaImageKey = keyof typeof images;
