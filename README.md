# Commerce Engine Starter Projects

A monorepo of production-ready e-commerce starter applications built with Commerce Engine, spanning multiple modern frameworks.

## Monorepo Structure

```
ce-starter-projects/
├── apps/
│   ├── linea/                    # Linea · Vite SPA (React)
│   ├── linea-tanstack/           # Linea · TanStack Start (React)
│   ├── linea-next/               # Linea · Next.js
│   ├── linea-astro/              # Linea · Astro
│   ├── linea-svelte/             # Linea · SvelteKit
│   ├── little-things/            # Little Things · Vite SPA (React)
│   ├── little-things-tanstack/   # Little Things · TanStack Start (React)
│   ├── little-things-next/       # Little Things · Next.js
│   ├── little-things-astro/      # Little Things · Astro
│   ├── little-things-svelte/     # Little Things · SvelteKit
│   ├── soja/                     # Soja · Vite SPA (React)
│   ├── soja-tanstack/            # Soja · TanStack Start (React)
│   ├── soja-next/                # Soja · Next.js
│   ├── soja-astro/               # Soja · Astro
│   └── soja-svelte/              # Soja · SvelteKit
├── packages/
│   ├── ui/                       # Linea design system (tokens, primitives, assets)
│   ├── linea-shared/             # Linea feature components and helpers
│   ├── little-things-ui/         # Little Things design system (standalone)
│   ├── little-things-shared/     # Little Things feature components and helpers
│   ├── soja-ui/                  # Soja design system (standalone)
│   └── soja-shared/              # Soja feature components and helpers
├── turbo.json
├── biome.json
└── package.json
```

Three independent storefront brands, each implemented across five frameworks on its
own design system + shared feature package:

- **Linea** — jewelry storefront (`@ce/ui` + `@ce/linea-shared`)
- **Little Things** — gadgets storefront (`@ce/little-things-ui` + `@ce/little-things-shared`)
- **Soja** — skincare storefront (`@ce/soja-ui` + `@ce/soja-shared`)

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [Bun](https://bun.sh/) >= 1.3.8

## Quick Start

```bash
# Clone the repository
git clone <repo-url> ce-starter-projects
cd ce-starter-projects

# Install dependencies
bun install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your Commerce Engine API credentials

# Start a dev server (pick one)
bun run dev:linea          # Vite SPA
bun run dev:linea-tanstack      # TanStack Start
bun run dev:linea-next     # Next.js
bun run dev:linea-astro    # Astro
bun run dev:linea-svelte   # SvelteKit
```

## Available Apps

Each brand ships the same storefront across all five frameworks.

**Linea** (jewelry):

| App | Framework | Description |
|-----|-----------|-------------|
| `linea` | Vite + React | Client-side single-page application |
| `linea-tanstack` | TanStack Start | Server-side rendered React application |
| `linea-next` | Next.js | Full-stack React with App Router |
| `linea-astro` | Astro | Content-focused with island architecture |
| `linea-svelte` | SvelteKit | Svelte 5 with server-side rendering |

**Little Things** (gadgets):

| App | Framework | Description |
|-----|-----------|-------------|
| `little-things` | Vite + React | Client-side single-page application |
| `little-things-tanstack` | TanStack Start | Server-side rendered React application |
| `little-things-next` | Next.js | Full-stack React with App Router |
| `little-things-astro` | Astro | Content-focused with island architecture |
| `little-things-svelte` | SvelteKit | Svelte 5, native reimplementation (no React shared package) |

**Soja** (skincare):

| App | Framework | Description |
|-----|-----------|-------------|
| `soja` | Vite + React | Client-side single-page application |
| `soja-tanstack` | TanStack Start | Server-side rendered React application |
| `soja-next` | Next.js | Full-stack React with App Router |
| `soja-astro` | Astro | Content-focused with island architecture |
| `soja-svelte` | SvelteKit | Svelte 5, native reimplementation (no React shared package) |

Each brand demonstrates the same Commerce Engine integration across different frameworks. The four
React apps per brand share that brand's feature package; the SvelteKit app reimplements the UI
natively, reusing only the brand's framework-neutral design tokens/assets.

Dev ports are allocated per brand — Linea 8080–8084, Little Things 8090–8094, Soja 8100–8104 — in
the order listed above, so several brands can run side by side.

## Scripts

Run from the repo root:

| Command | Description |
|---------|-------------|
| `bun run dev:<app>` | Start dev server for a specific app |
| `bun run build` | Build all apps and packages |
| `bun run build:<app>` | Build a specific app |
| `bun run check` | Run Biome linting and formatting checks |
| `bun run typecheck` | Run TypeScript type checking |
| `bun run lint` | Run linter |
| `bun run format` | Run formatter |

Replace `<app>` with one of: `linea`, `linea-tanstack`, `linea-next`, `linea-astro`, `linea-svelte`, `little-things`, `little-things-tanstack`, `little-things-next`, `little-things-astro`, `little-things-svelte`, `soja`, `soja-tanstack`, `soja-next`, `soja-astro`, `soja-svelte`.

> Each app reads its Commerce Engine credentials from its own `.env` (`VITE_*` for the Vite/TanStack
> apps, `NEXT_PUBLIC_*` for Next.js, `PUBLIC_*` for Astro/SvelteKit). See each app's `.env.example`.

## Documentation

For full Commerce Engine documentation, visit [https://docs.commerceengine.com](https://docs.commerceengine.com).

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
