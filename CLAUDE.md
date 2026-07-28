# CLAUDE.md

Commerce Engine starter monorepo. Use the `ce` skill for Commerce Engine work.

Two independent storefront brands, each with its own design system + feature package, ported across
the same five frameworks:

- **Linea** (jewelry): `@ce/ui` + `@ce/linea-shared`
- **Little Things** (gadgets): `@ce/little-things-ui` + `@ce/little-things-shared`

Work within one brand's packages/apps; never mix a brand's design system or feature package into the
other. Pick the read order for the brand you're changing.

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

## Boundaries

- `@ce/ui` and `@ce/little-things-ui` are design systems only (each its own brand; they are separate, standalone packages and must not depend on each other).
- `@ce/linea-shared` / `@ce/little-things-shared` own reusable feature components and shared helpers for their brand.
- Apps own routing, search navigation, SDK/bootstrap code, page entrypoints, and framework-specific asset wiring.
- Prefer adding props/contracts to shared components over hard-coding app-local routes or public asset paths.
- Prefer thin wrappers in apps over duplicating shared feature components.
- The `*-svelte` apps are the Svelte 5 / SvelteKit ports. Each has its own component implementations (not wrappers around the brand's React feature package) but reuses the brand's design-system utilities, theme, and assets:
  - `apps/linea-svelte` reuses `@ce/ui`; `apps/little-things-svelte` reuses `@ce/little-things-ui`.
- Keep the two brands isolated: a Little Things app must never import `@ce/ui` / `@ce/linea-shared`, and vice versa.

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
```
