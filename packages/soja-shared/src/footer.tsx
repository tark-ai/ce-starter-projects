import { images } from "@ce/soja-ui/lib/images";
import * as React from "react";
import type { SojaLinkComponent, SojaRoute } from "./lib/routing";
import { SojaWordmark } from "./logo";

const SITE_LINKS: Array<{ label: string; route: SojaRoute }> = [
  { label: "Home", route: { path: "/" } },
  { label: "Shop", route: { path: "/all-products" } },
  { label: "Our story", route: { path: "/about" } },
  { label: "FAQs", route: { path: "/faq" } },
  { label: "Privacy policy", route: { path: "/privacy-policy" } },
  { label: "Terms of service", route: { path: "/terms-of-service" } },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Twitter", href: "https://x.com" },
  { label: "YouTube", href: "https://www.youtube.com" },
  { label: "TikTok", href: "https://tiktok.com" },
];

/** Resolve to confirm the signup; reject to surface the error state. */
export type NewsletterSubmit = (email: string) => void | Promise<void>;

export interface FooterProps {
  LinkComponent: SojaLinkComponent;
  onNewsletterSubmit?: NewsletterSubmit;
  locale?: string;
}

export function Footer({
  LinkComponent,
  onNewsletterSubmit,
  locale = "Denmark / DKK",
}: FooterProps) {
  return (
    <footer className="relative overflow-hidden bg-neutral-800 text-white">
      <img
        src={images.footer}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="soja-container relative grid gap-14 py-20 tablet:grid-cols-3 tablet:gap-8 tablet:py-28">
        <div className="flex flex-col items-start gap-8">
          <SojaWordmark className="h-6" />
          <NewsletterForm onSubmit={onNewsletterSubmit} />
        </div>

        <nav className="flex flex-col gap-3">
          {SITE_LINKS.map((link) => (
            <LinkComponent
              key={link.label}
              route={link.route}
              className="w-fit text-meta transition-opacity duration-300 ease-soja hover:opacity-60"
            >
              {link.label}
            </LinkComponent>
          ))}

          <div className="mt-14 flex flex-col gap-1 text-meta text-white/60">
            <span>{locale}</span>
            <span>Copyright © {new Date().getFullYear()} Soja Inc. All rights reserved</span>
          </div>
        </nav>

        <nav className="flex flex-col gap-3">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit text-meta transition-opacity duration-300 ease-soja hover:opacity-60"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}

type NewsletterState = "idle" | "submitting" | "done" | "error" | "unavailable";

function NewsletterForm({ onSubmit }: { onSubmit?: NewsletterSubmit }) {
  const [email, setEmail] = React.useState("");
  const [state, setState] = React.useState<NewsletterState>("idle");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || state === "submitting") return;

    // No handler means nothing is stored, so don't promise an email that won't arrive.
    if (!onSubmit) {
      setState("unavailable");
      return;
    }

    setState("submitting");
    try {
      await onSubmit(trimmed);
      setState("done");
      setEmail("");
    } catch {
      setState("error");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="max-w-[300px] text-meta">Join our club and get 10% off your first purchase</p>

      {state === "done" ? (
        <p className="text-meta text-white/70">Thank you — check your inbox.</p>
      ) : state === "unavailable" ? (
        <p className="text-meta text-white/70">
          Newsletter signup isn't connected on this storefront yet.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          <form onSubmit={handleSubmit} className="flex max-w-[320px]">
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={state === "submitting"}
              placeholder="Your email"
              aria-label="Email address"
              className="h-11 min-w-0 flex-1 bg-white px-3 text-meta text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={state === "submitting"}
              className="h-11 shrink-0 bg-neutral-900 px-5 text-meta text-white transition-opacity duration-300 ease-soja hover:opacity-80 disabled:opacity-60"
            >
              {state === "submitting" ? "Joining…" : "Join"}
            </button>
          </form>

          {state === "error" && (
            <p role="alert" className="text-meta text-white/70">
              That didn't go through. Please try again.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
