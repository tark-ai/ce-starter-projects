/**
 * Paired with `--breakpoint-tablet` in theme.css. The `tablet:` variants decide
 * whether the mobile drawer is visible at all, so JS that reacts to the drawer
 * being hidden has to agree with the CSS exactly.
 */
export const TABLET_BREAKPOINT = "50.625rem";

export const TABLET_MEDIA_QUERY = `(min-width: ${TABLET_BREAKPOINT})`;
