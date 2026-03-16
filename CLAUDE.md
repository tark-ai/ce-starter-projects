# CLAUDE.md

Commerce Engine starter monorepo. Use the `ce` skill for Commerce Engine work.

## Read Order

1. If the change is framework-agnostic Linea UI or feature logic, start in `packages/linea-shared/src`.
2. If the change is a primitive, theme token, shared utility, or shared asset, start in `packages/ui/src`.
3. If the change touches routing, page composition, SDK setup, or framework APIs, start in the target app:
   - `apps/linea/src/App.tsx`, `apps/linea/src/pages`, `apps/linea/src/lib/linea-routing.tsx`
   - `apps/linea-ssr/src/routes`, `apps/linea-ssr/src/lib/linea-routing.tsx`
   - `apps/linea-next/src/app`, `apps/linea-next/src/lib/linea-routing.tsx`

## Boundaries

- `@ce/ui` is design system only.
- `@ce/linea-shared` owns reusable Linea feature components and shared helpers.
- Apps own routing, search navigation, SDK/bootstrap code, page entrypoints, and framework-specific asset wiring.
- Prefer adding props/contracts to shared components over hard-coding app-local routes or public asset paths.
- Prefer thin wrappers in apps over duplicating shared feature components.

## Commands

Run from the repo root:

```bash
bun run check
bun run typecheck
bun run build
bun run dev:linea
bun run dev:linea-ssr
bunx turbo run dev --filter=@ce/linea-next
```
