# Design Template

## What this template provides

- Multi-page build pipeline by scanning `src/pages/*.page.tsx`.
- Shared runtime contract through `window.App` in `src/core/app.ts`.
- Data/theme preload support from `src/data/*.json` with production inline optimization.
- Directory layout aligned:
  - `src/data/`
  - `src/components/`
  - `src/pages/`
  - `src/stores/`
  - `src/snapshots/`
  - `src/utils/`

## Runtime contract

Use the global runtime object:

- `window.App.store`
- `window.App.theme`
- `window.App.transitionTo(pageId, params?)`
- `window.App.goBack()`

Navigation page ids must be lowercase and match `[page]` in `src/pages/[page].page.tsx`.

## Quick start

```bash
pnpm install
pnpm run dev
```

## Validation commands

```bash
pnpm run typecheck
pnpm run build
```

## Notes

- `src/core/` is runtime kernel; treat it as template internals.
- `src/data/`, `src/components/`, `src/pages/`, `src/stores/`, `src/snapshots/`, and `src/utils/` are intentionally empty and use `.gitkeep` placeholders.
- To run `build`, add at least one page file using `src/pages/[page].page.tsx`.
