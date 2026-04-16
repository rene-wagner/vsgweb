# Repository Notes

## Working Principles

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that your changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" -> "Write tests for invalid inputs, then make them pass"
- "Fix the bug" -> "Write a test that reproduces it, then make it pass"
- "Refactor X" -> "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```text
1. [Step] -> verify: [check]
2. [Step] -> verify: [check]
3. [Step] -> verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## Source Of Truth
- There is no repo `README`, CI workflow, Cursor/Copilot instruction file, or `opencode.json` here. Trust `package.json`, `turbo.json`, TS config, and Vite config over assumptions.

## Workspace
- Package manager is `npm@11.12.1` with workspaces only under `app/*` and `packages/*`.
- Root scripts are Turbo entrypoints: `npm run dev`, `build`, `lint`, `format`, `format:check`.
- Prefer package-local commands while editing a single workspace instead of running Turbo across the repo.

## Main Packages
- `app/web` is the only application. `src/main.ts` mounts Vue, Pinia, the router, and injects a CSP meta tag at runtime.
- `app/web/src/App.vue` is the app shell. Navbar, footer, toast container, and cookie banner live there, not in routed layouts.
- `app/web/src/router/index.ts` is the route map and uses lazy-loaded views.
- `packages/vsg-sdk` is a real TypeScript library with source in `packages/vsg-sdk/src/index.ts`; do not assume it is empty or generated.
- `app/web` does not currently import `@vsg/vsg-sdk`.

## Web Commands
- Use `npm run dev --workspace web` for the Vite dev server.
- Use `npm run build --workspace web` for the real production build: `vue-tsc -b && vite build`.
- Use `npm run lint --workspace web` for focused verification. It already runs `npm run type-check` first, then `oxlint --vue-plugin --deny-warnings src vite.config.ts`.
- Use `npm run format:check --workspace web` before `npm run format --workspace web`; formatting is `oxfmt` and will rewrite files.
- There is no test runner configured in this repo right now. For most changes, verification is `lint` and/or `build`.

## Web Config Quirks
- The only path alias is `@/* -> ./src/*`, defined in `app/web/tsconfig.app.json` and mirrored in `app/web/vite.config.ts`.
- `app/web/tsconfig.app.json` intentionally does not use `baseUrl`; do not reintroduce it when fixing imports.
- `VITE_API_BASE_URL` is required across the web app and is also used to build the CSP in `src/main.ts`, so treat env changes as runtime behavior changes, not just API wiring.

## Structure
- `app/web/src/components` is organized by purpose, not by framework defaults: `app/`, `ui/`, `forms/`, `content/`, `department/`.
- Club pages live under `app/web/src/views/verein/`.

## Formatting
- Oxfmt is the formatter in both workspaces and currently normalizes imports/strings to double quotes.
