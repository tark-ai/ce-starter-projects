export const SITE_URL = "https://soja-tanstack.demo.commercengine.io";
export const SITE_NAME = "Soja";

/** Absolute because scrapers resolve og:image against the origin, not the route. */
export const OG_IMAGE = {
  url: `${SITE_URL}/og-image.jpg`,
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} — rituals of natural skincare`,
};
