# Repository Guidelines

## Project Structure & Module Organization
- Source code lives in `src/` (Vue 3 components, layouts) with `pages/` for Markdown content rendered via Vite SSG. Shared config sits in `vite.config.ts`, `unocss.config.ts`, and `eslint.config.js`.
- Generated output goes to `dist/` after builds. Assets for specific posts live beside their markdown (e.g., `pages/monthly/assets-2025_11/`).
- Scripts and automation are under `scripts/`; type configs live in `tsconfig*.json`.

## Build, Test, and Development Commands
- `pnpm dev` — run the Vite dev server.
- `pnpm build` — type-check (`vue-tsc`), build static site via `vite-ssg`, then regenerate RSS (`scripts/rss.ts`).
- `pnpm preview --host --port 4173` — serve the built site locally to sanity-check pages.
- `pnpm lint` / `pnpm lint:fix` — run ESLint (Antfu config) with cache and autofix.

## Coding Style & Naming Conventions
- TypeScript + Vue SFCs; prefer `<script setup lang="ts">` and composition API.
- Styling uses UnoCSS utility classes; avoid inline styles when utilities exist.
- Keep components small and colocated; place per-article assets under matching `assets-*` folders.
- Follow ESLint rules in `eslint.config.js`; rely on Prettier-equivalent defaults in the Antfu config (2-space indent, semicolonless).

## Testing Guidelines
- No formal test suite is present; rely on build + preview for regression checks.
- When adding logic-heavy code, consider adding lightweight checks in `scripts/` or unit-style utilities under `src/` and run via `pnpm build` to catch type errors.

## Commit & Pull Request Guidelines
- Use clear, action-oriented commit messages (e.g., `fix progress bar calc`, `add monthly 2025_12 draft`). Keep scope focused.
- For PRs: include a short summary, link related issues, and add screenshots or GIFs for UI/visual changes. Note any content pages added/updated and whether assets were included.

## Security & Configuration Tips
- Avoid committing secrets; this repo is static and should not require runtime secrets.
- Keep Node/pnpm versions aligned with `package.json`’s `packageManager` entry (pnpm 10.x). After updates, rerun `pnpm install` and `pnpm build` to ensure SSG output stays valid.
