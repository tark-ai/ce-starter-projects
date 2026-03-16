import { IMAGEKIT_ENDPOINT } from "@ce/ui/lib/images";
import { Image } from "@imagekit/react";
import type { LineaLinkComponent } from "./lib/routing";

// --- PageHeader ---

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="pr-6 py-16 border-b border-border">
      <h1 className="text-4xl md:text-5xl font-light text-foreground mb-4">{title}</h1>
      {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
    </header>
  );
}

// --- ContentSection ---

interface ContentSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function ContentSection({ title, children, className = "" }: ContentSectionProps) {
  return (
    <section className={`pr-6 py-16 ${className}`}>
      {title && <h2 className="text-3xl font-light text-foreground mb-8">{title}</h2>}
      {children}
    </section>
  );
}

// --- ImageTextBlock ---

interface ImageTextBlockProps {
  image: string;
  imageAlt: string;
  title: string;
  content: string;
  imagePosition?: "left" | "right";
}

export function ImageTextBlock({
  image,
  imageAlt,
  title,
  content,
  imagePosition = "left",
}: ImageTextBlockProps) {
  return (
    <div
      className={`flex flex-col ${imagePosition === "right" ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 items-center`}
    >
      <div className="flex-1">
        <Image
          urlEndpoint={IMAGEKIT_ENDPOINT}
          src={image.replace(IMAGEKIT_ENDPOINT, "")}
          alt={imageAlt}
          width={1792}
          height={1794}
          sizes="(max-width: 1024px) calc(100vw - 48px), calc(50vw - 48px)"
          transformation={[{ quality: 80 }]}
          className="w-full aspect-square lg:aspect-auto lg:h-[800px] object-cover"
        />
      </div>
      <div className="flex-1 space-y-6">
        <h3 className="text-2xl font-light text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{content}</p>
      </div>
    </div>
  );
}

// --- StoreMap ---

const stores = [
  {
    name: "LINEA Madison Avenue",
    address: "789 Madison Avenue, New York, NY 10065",
  },
  {
    name: "LINEA Beverly Hills",
    address: "456 Rodeo Drive, Beverly Hills, CA 90210",
  },
  {
    name: "LINEA SoHo",
    address: "123 Spring Street, New York, NY 10012",
  },
];

export function StoreMap() {
  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-border bg-muted/10 relative">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12063.046788464958!2d-74.0059413!3d40.7489054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sus!4v1641234567890!5m2!1sen!2sus"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-full"
        title="Store locations map"
      />

      <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-4 max-w-xs">
        <h4 className="text-sm font-medium text-foreground mb-3">Our Locations</h4>
        <div className="space-y-2">
          {stores.map((store) => (
            <div key={store.name} className="text-xs">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                <span className="font-medium text-foreground">{store.name}</span>
              </div>
              <p className="text-muted-foreground ml-4">{store.address}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- AboutSidebar ---

const aboutPages = [
  { name: "Our Story", path: "/about/our-story" },
  { name: "Sustainability", path: "/about/sustainability" },
  { name: "Size Guide", path: "/about/size-guide" },
  { name: "Customer Care", path: "/about/customer-care" },
  { name: "Store Locator", path: "/about/store-locator" },
];

interface AboutSidebarProps {
  currentPath: string;
  LinkComponent: LineaLinkComponent;
}

export function AboutSidebar({ currentPath, LinkComponent }: AboutSidebarProps) {
  return (
    <aside className="hidden md:block w-64 sticky top-32 h-fit px-6">
      <nav className="space-y-1">
        <h3 className="text-lg font-light text-foreground mb-6">About</h3>
        {aboutPages.map((page) => {
          const isActive = currentPath === page.path;
          return (
            <LinkComponent
              key={page.path}
              route={{ path: page.path }}
              className={`block py-2 text-sm font-light transition-all ${
                isActive
                  ? "text-primary underline decoration-2 underline-offset-4"
                  : "text-muted-foreground hover:text-foreground hover:underline hover:decoration-1 hover:underline-offset-4"
              }`}
            >
              {page.name}
            </LinkComponent>
          );
        })}
      </nav>
    </aside>
  );
}
