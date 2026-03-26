import defaultLogoSrc from "./assets/linea-jewelry-inc.svg";
import type { LineaLinkComponent } from "./lib/routing";

interface FooterProps {
  LinkComponent: LineaLinkComponent;
  logoSrc?: string;
}

export function Footer({ LinkComponent, logoSrc = defaultLogoSrc }: FooterProps) {
  return (
    <footer className="w-full bg-background text-foreground pt-8 pb-2 px-6 border-t border-border mt-48">
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
          {/* Brand - Left side */}
          <div>
            <img src={logoSrc} alt="Linea Jewelry Inc." className="mb-4 h-6 w-auto" />
            <p className="text-sm font-light text-muted-foreground leading-relaxed max-w-md mb-6">
              Minimalist jewelry crafted for the modern individual
            </p>

            {/* Contact Information */}
            <div className="space-y-2 text-sm font-light text-muted-foreground">
              <div>
                <p className="font-normal text-foreground mb-1">Visit Us</p>
                <p>123 Madison Avenue</p>
                <p>New York, NY 10016</p>
              </div>
              <div>
                <p className="font-normal text-foreground mb-1 mt-3">Contact</p>
                <p>+1 (212) 555-0123</p>
                <p>hello@lineajewelry.com</p>
              </div>
            </div>
          </div>

          {/* Link lists - Right side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Shop */}
            <div>
              <p className="text-sm font-normal mb-4">Shop</p>
              <ul className="space-y-2">
                {[
                  { route: "/category/new-in", label: "New In" },
                  { route: "/category/rings", label: "Rings" },
                  { route: "/category/earrings", label: "Earrings" },
                  { route: "/category/bracelets", label: "Bracelets" },
                  { route: "/category/necklaces", label: "Necklaces" },
                ].map(({ route, label }) => (
                  <li key={route}>
                    <LinkComponent
                      route={{ path: route }}
                      className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {label}
                    </LinkComponent>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <p className="text-sm font-normal mb-4">Support</p>
              <ul className="space-y-2">
                {[
                  { route: "/about/size-guide", label: "Size Guide" },
                  { route: "/about/customer-care", label: "Care Instructions" },
                  { route: "/about/customer-care", label: "Returns" },
                  { route: "/about/customer-care", label: "Shipping" },
                  { route: "/about/customer-care", label: "Contact" },
                ].map(({ route, label }) => (
                  <li key={label}>
                    <LinkComponent
                      route={{ path: route }}
                      className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {label}
                    </LinkComponent>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div>
              <p className="text-sm font-normal mb-4">Connect</p>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://pinterest.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Pinterest
                  </a>
                </li>
                <li>
                  <LinkComponent
                    route={{ path: "/about/customer-care" }}
                    className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Newsletter
                  </LinkComponent>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section - edge to edge separator */}
      <div className="border-t border-border -mx-6 px-6 pt-2">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm font-light text-foreground mb-1 md:mb-0">
            MIT Licensed. A{" "}
            <a
              href="https://www.commercengine.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-muted-foreground transition-colors underline"
            >
              Commerce Engine
            </a>{" "}
            starter built on a template by Rickard Liljeros
          </p>
          <div className="flex space-x-6">
            <LinkComponent
              route={{ path: "/privacy-policy" }}
              className="text-sm font-light text-foreground hover:text-muted-foreground transition-colors"
            >
              Privacy Policy
            </LinkComponent>
            <LinkComponent
              route={{ path: "/terms-of-service" }}
              className="text-sm font-light text-foreground hover:text-muted-foreground transition-colors"
            >
              Terms of Service
            </LinkComponent>
          </div>
        </div>
      </div>
    </footer>
  );
}
