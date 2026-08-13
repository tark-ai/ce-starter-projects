export const SITE_URL = "https://soja-next.demo.commercengine.io";
export const SITE_NAME = "Soja";

const OG_ALT = `${SITE_NAME} — rituals of natural skincare`;

// Page-level `openGraph` replaces this rather than merging, so every page that
// sets `openGraph` must spread it back in. JPEG first: AVIF is not decoded by
// most scrapers.
export const OG_IMAGES = [
  { url: "/og-image.jpg", width: 1200, height: 630, alt: OG_ALT, type: "image/jpeg" },
  { url: "/og-image.avif", width: 1024, height: 1536, alt: OG_ALT, type: "image/avif" },
];

export const TWITTER_IMAGE = "/og-image.jpg";
