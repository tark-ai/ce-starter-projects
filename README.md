# Commerce Engine Starter Projects

A monorepo of production-ready e-commerce starter applications built with Commerce Engine, spanning multiple modern frameworks.

## Monorepo Structure

```
ce-starter-projects/
├── apps/
│   ├── linea/            # Vite SPA (React)
│   ├── linea-tanstack/   # TanStack Start (React)
│   ├── linea-next/       # Next.js
│   ├── linea-astro/      # Astro
│   └── linea-svelte/     # SvelteKit
├── packages/
│   ├── ui/               # Shared design system (tokens, primitives, assets)
│   └── linea-shared/     # Shared Linea feature components and helpers
├── turbo.json
├── biome.json
└── package.json
```

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

| App | Framework | Description |
|-----|-----------|-------------|
| `linea` | Vite + React | Client-side single-page application |
| `linea-tanstack` | TanStack Start | Server-side rendered React application |
| `linea-next` | Next.js | Full-stack React with App Router |
| `linea-astro` | Astro | Content-focused with island architecture |
| `linea-svelte` | SvelteKit | Svelte 5 with server-side rendering |

All apps implement the same Linea jewelry e-commerce storefront, demonstrating Commerce Engine integration across different frameworks.

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

Replace `<app>` with one of: `linea`, `linea-tanstack`, `linea-next`, `linea-astro`, `linea-svelte`.

## Documentation

For full Commerce Engine documentation, visit [https://docs.commerceengine.com](https://docs.commerceengine.com).

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
