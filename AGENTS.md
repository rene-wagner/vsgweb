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

## Workspace
- Package manager is `npm` via workspaces (`packageManager: npm@11.12.1`). Use `npm`, not `pnpm` or `yarn`.
- Root scripts are Turbo entrypoints:
  - `npm run build` -> `turbo run build`
  - `npm run lint` -> `turbo run lint`
  - `npm run format` -> `turbo run format`
  - `npm run format:check` -> `turbo run format:check`
- Workspaces are only `app/*` and `packages/*`.

## Packages
- `app/web` is the only real application package right now.
- `packages/vsg-sdk` currently has no source tree; its `build` is a no-op, and its lint/format scripts are intentionally tolerant of missing `src/` files via `--no-error-on-unmatched-pattern`.

## Web App
- Main entrypoint is `app/web/src/main.ts`.
- App shell lives in `app/web/src/App.vue`; navbar/footer/toasts/cookie banner are not routed layouts anymore.
- Router lives in `app/web/src/router/index.ts`.
- Path alias is only `@/*` -> `./src/*`, defined in `app/web/tsconfig.app.json` and mirrored in `app/web/vite.config.ts`.
- `tsconfig.app.json` must not reintroduce `baseUrl`; the alias works through `paths` with `"./src/*"`.

## Web Verification
- Prefer package-local verification while editing `app/web`:
  - `npm run type-check --workspace web`
  - `npm run lint --workspace web`
  - `npm run format:check --workspace web`
- `web` lint already includes type-checking: `npm run lint --workspace web` runs `type-check` first and then `oxlint --vue-plugin --deny-warnings`.
- `web` formatting uses `oxfmt` on `src` and `vite.config.ts`. Running `npm run format --workspace web` will rewrite many files, so prefer `format:check` unless you intend that.

## Web Structure
- `app/web/src/components` is grouped by purpose, not by framework defaults:
  - `app/` for shell components
  - `ui/` for shared UI primitives
  - `forms/` for form-related components
  - `content/` for page content sections
  - `department/` for department-specific components
- Views remain under `app/web/src/views`, with club pages in `views/verein/`.

## Formatting / Style
- Oxfmt is active in both packages and currently formats files with double-quoted imports/strings; do not assume the previous quote style will be preserved.

## Missing Sources Of Truth
- There is currently no repo `README`, CI workflow, Copilot/Cursor/OpenCode repo config, or existing `AGENTS.md`. Trust the package scripts and config files over assumptions.
