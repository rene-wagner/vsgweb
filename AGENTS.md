# Repository Notes

## Source Of Truth
- There is no repo `README`, CI workflow, Cursor/Copilot instruction file, or `opencode.json` here. Trust `package.json`, `turbo.json`, TS config, and Vite config.

## Workspace
- Package manager is `npm@11.12.1` with workspaces under `app/*` and `packages/*`.
- `app/web` is the only application.
- `packages/sdk` and `packages/types` are real TypeScript libraries published as `@vsg/sdk` and `@vsg/types`.
- Root scripts are Turbo wrappers. `npm run build` is the safe cross-workspace build because Turbo runs dependency builds first.
- Prefer package-local commands when touching one workspace only.

## Commands
- Web dev server: `npm run dev --workspace web`
- Web verification: `npm run lint --workspace web` and `npm run build --workspace web`
- `app/web` lint already runs `npm run type-check` first.
- Web formatting: `npm run format:check --workspace web` before `npm run format --workspace web`
- Package verification from `packages/sdk` or `packages/types`: `npm run build`, `npm run lint`, `npm run format:check`
- `@vsg/sdk` and `@vsg/types` export from `dist/`, so rebuild changed packages before verifying downstream consumers.
- There is no test runner configured in this repo.

## App Wiring
- `app/web/src/main.ts` mounts Vue, Pinia, and the router, registers FontAwesome icons, and installs global error handlers. Add new solid icons there before using them.
- `app/web/src/App.vue` owns app startup loading/error states plus the navbar, footer, and cookie banner. Routed views only fill `<router-view />`.
- `app/web/src/router/index.ts` is the route map and uses lazy-loaded views.
- `app/web/src/lib/sdk.ts` is the shared API client entrypoint.

## Config Quirks
- The only web path alias is `@/* -> ./src/*`, defined in `app/web/tsconfig.app.json` and mirrored in `app/web/vite.config.ts`.
- `app/web/tsconfig.app.json` intentionally does not use `baseUrl`.
- `VITE_API_BASE_URL` is required by `src/lib/sdk.ts` and also read directly in `ContactForm.vue` and `services/media-items/media-item.service.ts`.
- Vite enables `vite-plugin-vue-devtools` only in development and keeps production sourcemaps on.
- Web formatting/linting only target `src` and `vite.config.ts`; package formatting/linting only target `src`.

## Structure
- `app/web/src/components` is organized by purpose: `app/`, `content/`, `department/`, `forms/`, `ui/`.
- Club pages live under `app/web/src/views/verein/`.
