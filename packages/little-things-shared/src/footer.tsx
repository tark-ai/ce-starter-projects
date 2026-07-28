import type { LittleThingsLinkComponent, LittleThingsRoute } from "./lib/routing";
import { LittleThingsLogo } from "./logo";

export { NewsletterBand } from "./content";

interface FooterColumn {
  heading: string;
  links: Array<{ label: string; route: LittleThingsRoute }>;
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Store",
    links: [
      { label: "All products", route: { path: "/all-products" } },
      { label: "Membership", route: { path: "/membership" } },
      { label: "Affiliates", route: { path: "/affiliates" } },
    ],
  },
  {
    heading: "Navigation",
    links: [
      { label: "Sign in", route: { path: "/login" } },
      { label: "Sign up", route: { path: "/signup" } },
      { label: "Contact", route: { path: "/contact" } },
      { label: "Blog", route: { path: "/blog" } },
      { label: "Helpcenter home", route: { path: "/help" } },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Overview", route: { path: "/about" } },
      { label: "License", route: { path: "/legal/terms" } },
      { label: "Documentation", route: { path: "/about" } },
      { label: "More Themes", route: { path: "/about" } },
      { label: "Privacy Policy", route: { path: "/legal/privacy" } },
    ],
  },
];

interface FooterProps {
  LinkComponent: LittleThingsLinkComponent;
  logoSrc?: string;
}

export function Footer({ LinkComponent }: FooterProps) {
  return (
    <footer className="relative w-full overflow-hidden border-t border-border bg-background text-foreground">
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 py-16 lg:px-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 flex items-center gap-3 md:col-span-1 md:block">
            <LinkComponent route={{ path: "/" }} className="inline-flex">
              <LittleThingsLogo className="h-5 w-5 text-foreground" />
            </LinkComponent>
            <p className="text-sm text-muted-foreground md:mt-3">
              © Copyright Little Things {new Date().getFullYear()}
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.heading}>
              <p className="mb-4 font-display text-2xl italic text-foreground">{column.heading}</p>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <LinkComponent
                      route={link.route}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </LinkComponent>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Oversized faint wordmark watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none overflow-hidden whitespace-nowrap px-6 pb-0 text-center font-display text-[22vw] italic leading-[0.75] text-foreground/15"
      >
        Little Things
      </div>
    </footer>
  );
}
