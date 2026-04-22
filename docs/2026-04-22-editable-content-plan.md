# EditableContent Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create an inline-editable markdown content component that renders MarkdownRenderer in display mode and an EasyMDE editor in edit mode when isEditingMode is active.

**Architecture:** Single `EditableContent.vue` component under `components/content/` using `<script setup lang="ts">`. Uses the existing `useEditingMode` composable for mode detection and the existing `MarkdownRenderer` for display. EasyMDE is instantiated on mount in edit mode and cleaned up on unmount/cancel/save.

**Tech Stack:** Vue 3 + TypeScript, Tailwind CSS v4, EasyMDE, FontAwesome, existing project composables

---

### Task 1: Install EasyMDE Dependencies

**Files:**
- Modify: `app/web/package.json`

- [ ] **Step 1: Install easymde and its types**

Run:
```bash
npm install easymde --workspace web
npm install -D @types/easymde --workspace web
```

Expected: Both packages added to `app/web/package.json` dependencies and devDependencies.

- [ ] **Step 2: Verify installation**

Run:
```bash
ls node_modules/easymde/dist/easymde.min.css
```

Expected: The file exists.

- [ ] **Step 3: Commit dependency additions**

```bash
git add app/web/package.json app/web/package-lock.json
git commit -m "feat: add easymde and @types/easymde dependencies"
```

---

### Task 2: Import EasyMDE CSS

**Files:**
- Modify: `app/web/src/main.ts`

The project already has EasyMDE theme overrides in `style.css` (lines 363-465), but the base EasyMDE CSS must be imported for the editor to render correctly.

- [ ] **Step 1: Add EasyMDE CSS import to main.ts**

In `app/web/src/main.ts`, add the EasyMDE CSS import after the existing `import "./style.css";` line:

```ts
import "easymde/dist/easymde.min.css";
```

The import section of `main.ts` should look like:

```ts
import { createApp, type ComponentPublicInstance } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./style.css";
import "easymde/dist/easymde.min.css";
```

- [ ] **Step 2: Verify the build still passes**

Run:
```bash
npm run build --workspace web
```

Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add app/web/src/main.ts
git commit -m "feat: import EasyMDE base CSS in main.ts"
```

---

### Task 3: Create the EditableContent Component

**Files:**
- Create: `app/web/src/components/content/EditableContent.vue`

This is the main component. It has three visual states based on `isEditingMode` and `isEditing`:

| Condition | Rendering |
|-----------|-----------|
| `!isEditingMode` | Plain `MarkdownRenderer` — no border, no hover |
| `isEditingMode && !isEditing` | `MarkdownRenderer` with gold dashed border, hover shows `fa-pen` icon |
| `isEditingMode && isEditing` | EasyMDE editor + Save/Cancel buttons inline |

- [ ] **Step 1: Create the EditableContent.vue component**

Create `app/web/src/components/content/EditableContent.vue` with the following complete content:

```vue
<script setup lang="ts">
import { nextTick, onUnmounted, ref } from "vue";
import EasyMDE from "easymde";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer.vue";
import { useEditingMode } from "@/composables/useEditingMode";
import { faPen } from "@fortawesome/free-solid-svg-icons";

interface Props {
  uuid: string;
  content?: string;
}

const props = defineProps<Props>();

const { isEditingMode } = useEditingMode();

const isEditing = ref(false);
const localContent = ref("");
const editorContainer = ref<HTMLElement | null>(null);
let easyMDEInstance: EasyMDE | null = null;

async function startEditing() {
  localContent.value = props.content ?? "";
  isEditing.value = true;

  await nextTick();

  if (editorContainer.value) {
    easyMDEInstance = new EasyMDE({
      element: editorContainer.value,
      initialValue: localContent.value,
      spellChecker: false,
      toolbar: ["bold", "italic", "heading", "link", "unordered-list", "quote"],
      status: false,
    });
  }
}

function destroyEditor() {
  if (easyMDEInstance) {
    easyMDEInstance.toTextArea();
    easyMDEInstance = null;
  }
}

function cancelEditing() {
  destroyEditor();
  localContent.value = "";
  isEditing.value = false;
}

function saveContent() {
  if (easyMDEInstance) {
    console.log({ uuid: props.uuid, content: easyMDEInstance.value() });
  }
  destroyEditor();
  isEditing.value = false;
}

onUnmounted(() => {
  destroyEditor();
});
</script>

<template>
  <div v-if="!isEditingMode">
    <MarkdownRenderer :content="content" />
  </div>

  <div
    v-else
    class="group relative rounded-lg border-2 border-dashed border-vsg-gold-500 p-3"
  >
    <div v-if="!isEditing">
      <MarkdownRenderer :content="content" />
      <button
        type="button"
        class="absolute top-2 right-2 text-vsg-gold-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        aria-label="Bearbeiten"
        @click="startEditing"
      >
        <FontAwesomeIcon :icon="faPen" />
      </button>
    </div>

    <div v-else>
      <div ref="editorContainer"></div>
      <div class="mt-2 flex justify-end gap-2">
        <button
          type="button"
          class="rounded-md bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600"
          @click="cancelEditing"
        >
          Abbrechen
        </button>
        <button
          type="button"
          class="btn-primary"
          @click="saveContent"
        >
          Speichern
        </button>
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Run lint to verify**

Run:
```bash
npm run lint --workspace web
```

Expected: No errors related to `EditableContent.vue`. The lint command includes type-checking.

- [ ] **Step 3: Commit**

```bash
git add app/web/src/components/content/EditableContent.vue
git commit -m "feat: add EditableContent component with inline EasyMDE editing"
```

---

### Task 4: Verify the Build and Format

**Files:**
- No new files; verification only

- [ ] **Step 1: Run format check**

Run:
```bash
npm run format:check --workspace web
```

Expected: No formatting errors. If there are errors, run `npm run format --workspace web` to fix them.

- [ ] **Step 2: Run full build**

Run:
```bash
npm run build --workspace web
```

Expected: Build succeeds. The `vue-tsc` type-check and `vite build` should both pass.

- [ ] **Step 3: Run lint**

Run:
```bash
npm run lint --workspace web
```

Expected: No errors.

- [ ] **Step 4: If any formatting issues were fixed in step 1, commit the fix**

```bash
git add -A
git commit -m "style: fix formatting in EditableContent"
```

Only run this commit if formatting was actually applied.

---

### Task 5: Manual Smoke Test

**Files:**
- Modify (temporarily for testing): Any view that renders markdown content, e.g., `app/web/src/views/PostView.vue` or `app/web/src/components/content/WelcomeSection.vue`

The project has no test runner. Verify manually:

- [ ] **Step 1: Temporarily add EditableContent to a view**

Open a view file that currently uses `MarkdownRenderer` to display content. As a quick smoke test, you can temporarily replace a `<MarkdownRenderer>` usage with `<EditableContent>` and pass a hard-coded `uuid` and `content` prop. For example, in `WelcomeSection.vue`, find the `<MarkdownRenderer>` usage and temporarily replace it:

```vue
<EditableContent uuid="test-welcome" :content="welcomeText" />
```

Make sure the import is added:
```ts
import EditableContent from "@/components/content/EditableContent.vue";
```

- [ ] **Step 2: Start the dev server**

Run:
```bash
npm run dev --workspace web
```

- [ ] **Step 3: Verify non-editing mode behavior**

In a normal browser window (not embedded in an iframe with an embed token), navigate to the page where EditableContent is used. Verify:
- The content renders the same as before (MarkdownRenderer works)
- No gold border appears
- No edit icon on hover

- [ ] **Step 4: Verify editing mode behavior (manual simulation)**

To test the editing mode, temporarily add `isEditingMode` override in the composable or modify `EditableContent.vue` to force `isEditingMode` to `true` for testing. Verify:
- Gold dashed border appears around the content
- Hovering over the area shows a `fa-pen` icon in the top-right corner
- Clicking the edit icon replaces content with EasyMDE editor
- EasyMDE toolbar shows only: bold, italic, heading, link, unordered-list, quote
- "Abbrechen" button resets state back to display mode
- "Speichern" button logs `{ uuid, content }` to the console and closes the editor
- Switching back and forth between edit and view mode works without errors

- [ ] **Step 5: Remove temporary test changes**

Revert the temporary changes made in Step 1. Do NOT commit test changes.

```bash
git checkout -- app/web/src/components/content/WelcomeSection.vue
# Or whichever file was modified
```

---

### Task 6: Final Verification and Commit

- [ ] **Step 1: Run the full verification suite**

Run:
```bash
npm run lint --workspace web && npm run build --workspace web
```

Expected: No errors from either command.

- [ ] **Step 2: Verify all changes are committed**

Run:
```bash
git status
git log --oneline -5
```

Expected: Clean working tree. Recent commits show:
1. `feat: add easymde and @types/easymde dependencies`
2. `feat: import EasyMDE base CSS in main.ts`
3. `feat: add EditableContent component with inline EasyMDE editing`

---

## Notes

- The `faPen` icon is already registered in `main.ts` — no additional icon registration needed.
- The existing EasyMDE theme overrides in `style.css` (lines 363-465) will automatically style the editor to match the VSG design system.
- The `btn-primary` utility class used for the "Speichern" button is defined in `style.css` and will apply the existing button styling.
- The `useEditingMode` composable is a singleton — `isEditingMode` is shared across all components that use it.
- No test runner is configured in this repo. Verification is done via lint, type-check, and build.