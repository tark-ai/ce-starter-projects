/**
 * Paired with `--breakpoint-tablet` in theme.css. The `tablet:` variants decide
 * whether the mobile drawer is visible at all, so JS that reacts to the drawer
 * being hidden has to agree with the CSS exactly.
 */
export const TABLET_BREAKPOINT = "50.625rem";

export const TABLET_MEDIA_QUERY = `(min-width: ${TABLET_BREAKPOINT})`;

/**
 * Calls `onTabletUp` immediately and on every change while the viewport sits at
 * `tablet` or wider, and returns an unsubscribe. The mobile drawer and its
 * toggle are hidden from `tablet` up, so growing past the breakpoint would
 * otherwise leave the scroll lock on with no way to clear it — every port needs
 * this same subscription, so it lives here rather than once per framework.
 */
export function subscribeToTabletUp(onTabletUp: () => void): () => void {
  const mediaQuery = window.matchMedia(TABLET_MEDIA_QUERY);
  const notifyIfWide = () => {
    if (mediaQuery.matches) onTabletUp();
  };
  notifyIfWide();
  mediaQuery.addEventListener("change", notifyIfWide);
  return () => mediaQuery.removeEventListener("change", notifyIfWide);
}
