# Commerce Engine Starter Projects

Monorepo for the Linea Commerce Engine storefront implemented in three frameworks, with a shared feature layer.

## Apps

- `@ce/linea` — Vite + React SPA in `apps/linea` (`bun run dev:linea`)
- `@ce/linea-ssr` — TanStack Start SSR app in `apps/linea-ssr` (`bun run dev:linea-ssr`)
- `@ce/linea-next` — Next.js App Router app in `apps/linea-next` (`bunx turbo run dev --filter=@ce/linea-next`)

## Shared Packages

- `@ce/ui` — design system primitives, theme, utilities, and shared assets
- `@ce/linea-shared` — reusable Linea feature components and helpers (`about`, `category`, `content`, `footer`, `header`, `product`)

## Architecture

- Put framework-agnostic Linea feature work in `packages/linea-shared`.
- Put primitives/theme work in `packages/ui`.
- Keep routing, page trees, SDK bootstrapping, and framework hooks inside each app.
- New framework examples should add thin adapters around `@ce/linea-shared`, not copy feature components.

## Commands

Run from the repo root:

```sh
bun install
bun run check
bun run typecheck
bun run build
```

## License

MIT
