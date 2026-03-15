// Override Next.js's StaticImageData type for external package image imports.
// @ce/ui assets are resolved as URL strings by the bundler, not as Next.js static images.
declare module "@ce/ui/assets/*.jpg" {
  const src: string;
  export default src;
}
