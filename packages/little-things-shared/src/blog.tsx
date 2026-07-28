import { Badge } from "@ce/little-things-ui/components/ui/badge";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { LittleThingsLinkComponent, LittleThingsRoute } from "./lib/routing";

// --- Types ---

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  imageAlt?: string;
  tags?: string[];
  body?: string[];
}

// --- BlogHero ---

interface BlogHeroProps {
  title?: string;
  subtitle?: string;
}

export function BlogHero({
  title = "Take a peek behind the curtain. Stories, thoughts and things we've been building.",
  subtitle = "From product drops to design philosophy — it's all here, straight from the source.",
}: BlogHeroProps) {
  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:py-24 lg:px-20">
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="mt-6 text-lg font-light text-muted-foreground">{subtitle}</p>
      </div>
    </section>
  );
}

// --- TagPill ---

interface TagPillProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  LinkComponent?: LittleThingsLinkComponent;
  route?: LittleThingsRoute;
}

export function TagPill({ label, active = false, onClick, LinkComponent, route }: TagPillProps) {
  const className = `inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-light transition-colors ${
    active
      ? "border-foreground bg-foreground text-background"
      : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
  }`;

  if (LinkComponent && route) {
    return (
      <LinkComponent route={route} className={className}>
        {label}
      </LinkComponent>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {label}
    </button>
  );
}

// --- TagFilterRow ---

const DEFAULT_BLOG_TAGS = [
  "audio",
  "automation",
  "eco friendly",
  "marketing",
  "noise",
  "notes",
  "people",
  "performance",
  "personalization",
  "productivity",
  "products",
  "speakers",
  "sustainable",
  "tech",
  "uiux",
  "web design",
  "web development",
];

interface TagFilterRowProps {
  tags?: string[];
  activeTag?: string | null;
  onSelectTag?: (tag: string | null) => void;
}

export function TagFilterRow({
  tags = DEFAULT_BLOG_TAGS,
  activeTag = null,
  onSelectTag,
}: TagFilterRowProps) {
  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 pb-8 lg:px-20">
      <div className="flex flex-wrap gap-2">
        <TagPill label="All" active={!activeTag} onClick={() => onSelectTag?.(null)} />
        {tags.map((tag) => (
          <TagPill
            key={tag}
            label={tag}
            active={activeTag === tag}
            onClick={() => onSelectTag?.(tag)}
          />
        ))}
      </div>
    </section>
  );
}

// --- ArticleCard ---

interface ArticleCardProps {
  article: Article;
  LinkComponent: LittleThingsLinkComponent;
}

export function ArticleCard({ article, LinkComponent }: ArticleCardProps) {
  return (
    <LinkComponent route={{ path: `/blog/${article.slug}` }} className="group block">
      <div className="aspect-video overflow-hidden rounded-lg bg-muted/40">
        <img
          src={article.image}
          alt={article.imageAlt || article.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-4 space-y-2">
        <h3 className="text-lg font-semibold leading-snug text-foreground group-hover:text-brand transition-colors">
          {article.title}
        </h3>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {article.author} on {article.date}
        </p>
        <p className="text-sm font-light leading-relaxed text-muted-foreground line-clamp-2">
          {article.excerpt}
        </p>
      </div>
    </LinkComponent>
  );
}

// --- ArticlePost ---

interface ArticlePostProps {
  article: Article;
  related?: Article[];
  LinkComponent: LittleThingsLinkComponent;
}

export function ArticlePost({ article, related = [], LinkComponent }: ArticlePostProps) {
  return (
    <article className="mx-auto w-full max-w-[1400px] px-6 py-12 lg:px-20">
      <div className="mx-auto max-w-3xl">
        <LinkComponent
          route={{ path: "/blog" }}
          className="inline-flex items-center gap-1 text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Read all articles</span>
        </LinkComponent>

        <h1 className="mt-8 text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          {article.title}
        </h1>
        <p className="mt-4 text-sm uppercase tracking-wide text-muted-foreground">
          {article.author} on {article.date}
        </p>

        <div className="mt-8 aspect-video overflow-hidden rounded-lg bg-muted/40">
          <img
            src={article.image}
            alt={article.imageAlt || article.title}
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mt-10 space-y-6 text-base font-light leading-relaxed text-muted-foreground">
          {(article.body ?? [article.excerpt]).map((paragraph, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static prose paragraphs have no stable id
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="lowercase">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {related.length > 0 && (
        <div className="mx-auto mt-20 max-w-6xl border-t border-border pt-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Keep reading</h2>
            <LinkComponent
              route={{ path: "/blog" }}
              className="inline-flex items-center gap-1 text-sm font-light text-brand hover:opacity-80 transition-opacity"
            >
              <span>Read all articles</span>
              <ArrowRight size={14} />
            </LinkComponent>
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            {related.map((relatedArticle) => (
              <ArticleCard
                key={relatedArticle.slug}
                article={relatedArticle}
                LinkComponent={LinkComponent}
              />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
