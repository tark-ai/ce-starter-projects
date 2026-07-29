// Override Next.js's StaticImageData type for external package image imports.
// @ce/little-things-ui assets are resolved as URL strings by the bundler, not as Next.js static images.
declare module "@ce/little-things-ui/assets/*.svg" {
  const src: string;
  export default src;
}

declare module "@fontsource-variable/inter";
declare module "@fontsource/instrument-serif/400.css";
declare module "@fontsource/instrument-serif/400-italic.css";
