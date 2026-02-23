# Commerce Engine Starter Projects

A collection of production-ready e-commerce storefront templates built with [Commerce Engine](https://www.commercengine.io). Each starter is a fully functional storefront you can clone, customize, and deploy.

## Starters

| Starter | Description | Stack |
| ------- | ----------- | ----- |
| [**Linea**](./apps/linea/) | Jewelry store template with product catalog, cart, and hosted checkout | Vite + React + TypeScript + Tailwind CSS v4 + shadcn/ui |

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) v1.3.8+
- A [Commerce Engine](https://www.commercengine.io) account with API credentials

### Setup

```sh
# Clone the repo
git clone https://github.com/commercengine/ce-starter-projects.git
cd ce-starter-projects

# Install dependencies
bun install

# Copy the environment file and add your Commerce Engine credentials
cp apps/linea/.env.example apps/linea/.env

# Start the dev server
bun run dev
```

The Linea storefront will be available at `http://localhost:8080`.

### Running a Single Starter

```sh
bunx turbo run dev --filter=@ce/linea
```

## Monorepo Structure

```
ce-starter-projects/
├── apps/
│   └── linea/           # Jewelry store starter
├── packages/            # Shared packages (future)
├── turbo.json           # Turborepo task pipelines
├── biome.json           # Linting & formatting config
└── package.json         # Workspace root
```

## Available Commands

All commands run from the repo root via [Turborepo](https://turbo.build):

```sh
bun run dev          # Start all dev servers
bun run build        # Production build
bun run check        # Lint & format check (Biome)
bun run check:fix    # Auto-fix lint & format issues
bun run typecheck    # TypeScript type checking
```

## Tech Stack

Every starter follows a consistent stack:

- **[Vite](https://vite.dev)** — Build tool & dev server
- **[React](https://react.dev)** — UI framework
- **[TypeScript](https://typescriptlang.org)** — Type safety
- **[Tailwind CSS v4](https://tailwindcss.com)** — Utility-first styling
- **[shadcn/ui](https://ui.shadcn.com)** — Component primitives
- **[@commercengine/storefront-sdk](https://www.npmjs.com/package/@commercengine/storefront-sdk)** — Commerce Engine SDK for product data, cart, and auth
- **[Commerce Engine Hosted Checkout](https://www.npmjs.com/package/@commercengine/checkout)** — Secure, pre-built drop-in customizable checkout
- **[Commerce Engine Checkout Studio](https://studio.checkout.commercengine.io)** - A no-code playground to customize hosted checkout with feature flags and remote config
## License

MIT
