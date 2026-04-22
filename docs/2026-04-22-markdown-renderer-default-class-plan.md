# MarkdownRenderer Default Class Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `useDefaultClass` prop to `MarkdownRenderer` so callers can disable the `.markdown-content` wrapper class while keeping current behavior by default.

**Architecture:** The change stays isolated to `app/web/src/components/ui/MarkdownRenderer.vue`. The component keeps its current markdown parsing logic and only extends the props definition plus the root template class binding. Existing call sites remain unchanged because the new prop defaults to `true`.

**Tech Stack:** Vue 3, TypeScript, `<script setup>`, oxlint, vue-tsc

---

### Task 1: Extend MarkdownRenderer Props

**Files:**
- Modify: `app/web/src/components/ui/MarkdownRenderer.vue`

- [ ] **Step 1: Update the props definition**

Replace the current props block:

```ts
interface Props {
  content: string | null | undefined;
}

const props = defineProps<Props>();
```

with:

```ts
interface Props {
  content: string | null | undefined;
  useDefaultClass?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  useDefaultClass: true,
});
```

- [ ] **Step 2: Update the Vue import**

Replace:

```ts
import { computed } from "vue";
```

with:

```ts
import { computed, withDefaults } from "vue";
```

If `withDefaults` is already globally available in the project tooling and the component builds without importing it, keep the existing import unchanged. The important part is that the file type-checks.

- [ ] **Step 3: Commit the props change**

```bash
git add app/web/src/components/ui/MarkdownRenderer.vue
git commit -m "feat: add useDefaultClass prop to MarkdownRenderer"
```

---

### Task 2: Make the Root Class Conditional

**Files:**
- Modify: `app/web/src/components/ui/MarkdownRenderer.vue`

- [ ] **Step 1: Change the root template class binding**

Replace the current template line:

```vue
<div v-if="renderedHtml" class="markdown-content" v-html="renderedHtml"></div>
```

with:

```vue
<div
  v-if="renderedHtml"
  :class="{ 'markdown-content': props.useDefaultClass }"
  v-html="renderedHtml"
></div>
```

This keeps the existing wrapper class by default and omits it only when `useDefaultClass` is explicitly `false`.

- [ ] **Step 2: Verify no call site changes are needed**

Check the existing usages in:

```text
app/web/src/views/PostView.vue
app/web/src/components/content/EditableContent.vue
```

They should remain unchanged because the prop defaults to `true`.

- [ ] **Step 3: Commit the template change**

```bash
git add app/web/src/components/ui/MarkdownRenderer.vue
git commit -m "feat: make MarkdownRenderer wrapper class optional"
```

---

### Task 3: Verify the Change

**Files:**
- Modify: `app/web/src/components/ui/MarkdownRenderer.vue`

- [ ] **Step 1: Run lint**

Run:

```bash
npm run lint --workspace web
```

Expected: `vue-tsc` and `oxlint` both complete without errors.

- [ ] **Step 2: Run formatting check**

Run:

```bash
npm run format:check --workspace web
```

Expected: no formatting issues.

If formatting fails, fix it with:

```bash
npm run format --workspace web
```

and commit the formatting-only change with:

```bash
git add app/web/src/components/ui/MarkdownRenderer.vue
git commit -m "style: format MarkdownRenderer"
```

- [ ] **Step 3: Run build**

Run:

```bash
npm run build --workspace web
```

Expected: build succeeds.

- [ ] **Step 4: Optional manual usage check**

If you want to verify the new API explicitly, temporarily use this snippet in a local test view:

```vue
<MarkdownRenderer :content="'## Test'" :use-default-class="false" />
```

Do not commit the temporary usage change unless the feature requires a real consumer update.

---

### Task 4: Final Verification

**Files:**
- Modify: `app/web/src/components/ui/MarkdownRenderer.vue`

- [ ] **Step 1: Confirm spec coverage**

Verify the implementation satisfies all requested behavior:

- `useDefaultClass` exists
- It defaults to `true`
- `.markdown-content` is applied when `true`
- `.markdown-content` is omitted when `false`
- Existing call sites remain unchanged

- [ ] **Step 2: Confirm clean git state**

Run:

```bash
git status
git log --oneline -5
```

Expected: only intentional changes are present, and the recent commits describe the MarkdownRenderer prop change clearly.
