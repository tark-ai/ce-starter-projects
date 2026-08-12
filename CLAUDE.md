# CLAUDE.md

Commerce Engine starter monorepo. Use the `ce` skill for Commerce Engine work.

Three independent storefront brands, each with its own design system + feature package, ported across
the same five frameworks:

- **Linea** (jewelry): `@ce/ui` + `@ce/linea-shared`
- **Little Things** (gadgets): `@ce/little-things-ui` + `@ce/little-things-shared`
- **Soja** (skincare): `@ce/soja-ui` + `@ce/soja-shared`

Work within one brand's packages/apps; never mix a brand's design system or feature package into
another. Pick the read order for the brand you're changing.

## Read Order

### Linea

1. Framework-agnostic Linea UI or feature logic → `packages/linea-shared/src`.
2. Primitive, theme token, shared utility, or shared asset → `packages/ui/src`.
3. Routing, page composition, SDK setup, or framework APIs → the target app:
   - `apps/linea/src/App.tsx`, `apps/linea/src/pages`, `apps/linea/src/lib/linea-routing.tsx`
   - `apps/linea-tanstack/src/routes`, `apps/linea-tanstack/src/lib/linea-routing.tsx`
   - `apps/linea-next/src/app`, `apps/linea-next/src/lib/linea-routing.tsx`
   - `apps/linea-astro/src/pages`, `apps/linea-astro/src/lib/linea-routing.tsx`
   - `apps/linea-svelte/src/routes`, `apps/linea-svelte/src/lib/linea-routing.ts`

### Little Things

1. Framework-agnostic UI or feature logic → `packages/little-things-shared/src`.
2. Primitive, theme token, shared utility, or shared asset → `packages/little-things-ui/src`.
3. Routing, page composition, SDK setup, or framework APIs → the target app:
   - `apps/little-things/src/App.tsx`, `apps/little-things/src/pages`, `apps/little-things/src/lib/little-things-routing.tsx`
   - `apps/little-things-tanstack/src/routes`, `apps/little-things-tanstack/src/lib/little-things-routing.tsx`
   - `apps/little-things-next/src/app`, `apps/little-things-next/src/lib/little-things-routing.tsx`
   - `apps/little-things-astro/src/pages`, `apps/little-things-astro/src/lib/little-things-routing.tsx`
   - `apps/little-things-svelte/src/routes`, `apps/little-things-svelte/src/lib/little-things-routing.ts`

### Soja

1. Framework-agnostic UI or feature logic → `packages/soja-shared/src`.
2. Primitive, theme token, shared utility, or shared asset → `packages/soja-ui/src`.
3. Routing, page composition, SDK setup, or framework APIs → the target app:
   - `apps/soja/src/App.tsx`, `apps/soja/src/pages`, `apps/soja/src/lib/soja-routing.tsx`
   - `apps/soja-tanstack/src/routes`, `apps/soja-tanstack/src/lib/soja-routing.tsx`
   - `apps/soja-next/src/app`, `apps/soja-next/src/lib/soja-routing.tsx`
   - `apps/soja-astro/src/pages`, `apps/soja-astro/src/lib/soja-routing.tsx`
   - `apps/soja-svelte/src/routes`, `apps/soja-svelte/src/lib/soja-routing.ts`

Soja differs from the other two brands in a few ways worth knowing before you edit it: it has **no
blog** and instead ships a `/faq` route, `@ce/soja-shared` adds `faq`, `photo-band` and `wishlist`
barrels plus `lib/{product-meta,wishlist}`, and the theme is square (`--radius: 0`) and all-serif
with **no brand accent token** — colour comes from photography, so don't add one.

## Boundaries

- `@ce/ui`, `@ce/little-things-ui` and `@ce/soja-ui` are design systems only (each its own brand; they are separate, standalone packages and must not depend on each other).
- `@ce/linea-shared` / `@ce/little-things-shared` / `@ce/soja-shared` own reusable feature components and shared helpers for their brand.
- Apps own routing, search navigation, SDK/bootstrap code, page entrypoints, and framework-specific asset wiring.
- Prefer adding props/contracts to shared components over hard-coding app-local routes or public asset paths.
- Prefer thin wrappers in apps over duplicating shared feature components.
- The `*-svelte` apps are the Svelte 5 / SvelteKit ports. Each has its own component implementations (not wrappers around the brand's React feature package) but reuses the brand's design-system utilities, theme, and assets:
  - `apps/linea-svelte` reuses `@ce/ui`; `apps/little-things-svelte` reuses `@ce/little-things-ui`; `apps/soja-svelte` reuses `@ce/soja-ui`.
  - A `*-svelte` app must not import its brand's `*-shared` package at all — routing, variants and any other helper it needs is a local mirror under `src/lib`.
- Keep the three brands isolated: an app must never import another brand's design system or feature package.
- `PoweredByBadge` is platform chrome, not brand chrome. It is intentionally identical in every app (white pill, shadow, multicolour glyph) even where that clashes with the brand's own language — don't restyle it.

## Commands

Run from the repo root:

```bash
bun run check
bun run typecheck
bun run build

# Linea
bun run dev:linea
bun run dev:linea-tanstack
bun run dev:linea-next
bun run dev:linea-astro
bun run dev:linea-svelte

# Little Things
bun run dev:little-things
bun run dev:little-things-tanstack
bun run dev:little-things-next
bun run dev:little-things-astro
bun run dev:little-things-svelte

# Soja
bun run dev:soja
bun run dev:soja-tanstack
bun run dev:soja-next
bun run dev:soja-astro
bun run dev:soja-svelte
```

Dev ports are allocated per brand: Linea 8080–8084, Little Things 8090–8094, Soja 8100–8104 (SPA,
TanStack, Next, Astro, SvelteKit in that order).
