# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

Commerce Engine reference storefronts monorepo. Each app under `apps/` is a self-contained starter storefront showcasing e-commerce patterns using the Commerce Engine platform. All storefronts use `@commercengine/storefront-sdk` for data and Commerce Engine hosted checkout for the purchase flow.

## Commands

All commands run from the monorepo root via Turbo (package manager: `bun@1.3.8`):

```bash
bun run dev          # Start dev servers (linea runs on port 8080)
bun run build        # Production build → apps/*/dist/
bun run check        # Biome lint + format check
bun run check:fix    # Biome lint + format auto-fix
bun run typecheck    # TypeScript type checking
```

Single-app filtering: `bunx turbo run dev --filter=@ce/linea`

Adding shadcn components — must run from inside the app directory:
```bash
cd apps/linea && bunx shadcn@latest add <component>
```

No test framework is configured.

## Monorepo Structure

```
apps/linea/          → @ce/linea — Jewelry e-commerce starter (Vite + React SPA)
packages/            → Shared packages (future)
biome.json           → Linting + formatting (root config, apps inherit)
turbo.json           → Task pipeline definitions
```

## Commerce Engine Integration

Use the `commercengine` skill for SDK API reference. Key rules:

- **Always import types from the SDK** — never define custom interfaces that duplicate API schemas: `import type { Cart, Product } from "@commercengine/storefront-sdk"`
- **Look up schemas before generating code** — fetch exact TypeScript definitions from `llm-docs.commercengine.io/storefront/schemas/{SchemaName}`
- **Hosted checkout** — do not build custom checkout flows; redirect to Commerce Engine hosted checkout
- **Response pattern** — every SDK method returns `{ data, error }`, always check `error` before using `data`
- **`variant_id` is always required** in cart item operations — pass `null` for products without variants

## App Architecture (Linea)

Vite 7 + React 19 + TypeScript 5.9 + Tailwind CSS v4 + shadcn/ui SPA.

**Routing**: React Router v7 with `BrowserRouter`, flat route structure defined in `src/App.tsx`. Routes include `/`, `/category/:category`, `/product/:productId`, `/checkout`, `/about/*`, plus legal pages.

**State**: No global state library. Local `useState` for component state. `@tanstack/react-query` QueryClient initialized in `App.tsx` for async data.

**Component organization**: Feature-grouped under `src/components/` (about, category, content, footer, header, product). `src/components/ui/` is exclusively shadcn primitives — do not manually edit those files.

**Pages**: Each page composes a Header → main content → Footer layout. Page components live in `src/pages/`.

**Path alias**: `@/` maps to `src/` (configured in both vite.config.ts and tsconfig).

## Tailwind CSS v4

CSS-first configuration — theme is defined in `src/index.css` via `@theme` directive, not in a `tailwind.config.ts`. Colors use HSL CSS variables with semantic tokens (`bg-background`, `text-foreground`, `text-muted-foreground`). PostCSS plugin is `@tailwindcss/postcss` (not `tailwindcss`). Dark mode: `@custom-variant dark (&:is(.dark *))`. Font: DM Sans via Google Fonts.

## Biome

- 2 spaces, double quotes, semicolons, 100 char line width, LF endings, trailing commas (ES5)
- File names must be kebab-case or PascalCase
- `noUnusedVariables`: error, `noUnusedImports`: warn, `noConsole`: warn
- React 19 auto JSX transform (`jsxRuntime: "transparent"`) — no `import React` needed
- `css.parser.tailwindDirectives: true` required for TW v4 syntax
- `components/ui/**` has relaxed export rules for shadcn multi-export files

## When Adding a New Starter App

1. Create under `apps/<name>/` with its own `package.json` (name: `@ce/<name>`)
2. Install `@commercengine/storefront-sdk` — import all types from the SDK, never duplicate them
3. Use hosted checkout (redirect, don't build custom checkout UI)
4. Follow the same Vite + React + TW v4 + shadcn stack unless there's a specific reason not to
5. Biome config at root applies automatically; add overrides in root `biome.json` if needed
