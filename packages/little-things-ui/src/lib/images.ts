// Placeholder brand imagery for Little Things.
// Uses deterministic Picsum photos so the UI renders real images while the real
// brand assets are pending. Swap these URLs for the final assets when ready;
// component call-sites stay unchanged.
const seed = (name: string, w: number, h: number) =>
  `https://picsum.photos/seed/little-things-${name}/${w}/${h}`;

export const IMAGEKIT_ENDPOINT = "https://images.tarkai.com";

export const images = {
  heroImage: seed("hero", 1600, 900),
  latestDrops: seed("latest-drops", 800, 800),
  seasonalGoods: seed("seasonal", 800, 800),
  weeklyDeals: seed("weekly-deals", 800, 800),
  allProducts: seed("all-products", 800, 800),
  editorialOne: seed("editorial-1", 800, 450),
  editorialTwo: seed("editorial-2", 800, 450),
  editorialThree: seed("editorial-3", 800, 450),
} as const;

export const imagePaths = {
  heroImage: images.heroImage,
  latestDrops: images.latestDrops,
  seasonalGoods: images.seasonalGoods,
  weeklyDeals: images.weeklyDeals,
  allProducts: images.allProducts,
  editorialOne: images.editorialOne,
  editorialTwo: images.editorialTwo,
  editorialThree: images.editorialThree,
} as const;
