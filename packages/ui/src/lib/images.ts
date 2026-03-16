export const IMAGEKIT_ENDPOINT = "https://images.tarkai.com";

const DIR = "/Linea";

export const imagePaths = {
  heroImage: `${DIR}/hero-image.jpg`,
  founders: `${DIR}/founders.jpg`,
  circularCollection: `${DIR}/circular-collection.jpg`,
  earringsCollection: `${DIR}/earrings-collection.jpg`,
  ringsCollection: `${DIR}/rings-collection.jpg`,
  linkBracelet: `${DIR}/link-bracelet.jpg`,
  organicEarring: `${DIR}/organic-earring.jpg`,
  arcusBracelet: `${DIR}/arcus-bracelet.jpg`,
  spanBracelet: `${DIR}/span-bracelet.jpg`,
} as const;

export const images = {
  heroImage: `${IMAGEKIT_ENDPOINT}${imagePaths.heroImage}`,
  founders: `${IMAGEKIT_ENDPOINT}${imagePaths.founders}`,
  circularCollection: `${IMAGEKIT_ENDPOINT}${imagePaths.circularCollection}`,
  earringsCollection: `${IMAGEKIT_ENDPOINT}${imagePaths.earringsCollection}`,
  ringsCollection: `${IMAGEKIT_ENDPOINT}${imagePaths.ringsCollection}`,
  linkBracelet: `${IMAGEKIT_ENDPOINT}${imagePaths.linkBracelet}`,
  organicEarring: `${IMAGEKIT_ENDPOINT}${imagePaths.organicEarring}`,
  arcusBracelet: `${IMAGEKIT_ENDPOINT}${imagePaths.arcusBracelet}`,
  spanBracelet: `${IMAGEKIT_ENDPOINT}${imagePaths.spanBracelet}`,
} as const;
