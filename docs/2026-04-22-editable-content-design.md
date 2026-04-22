# EditableContent Component Design

## Overview

A Vue 3 component that renders markdown content inline with an edit mode overlay. When `isEditingMode` is active (via the existing `useEditingMode` composable), the component displays a gold dashed border and a hover edit icon. Clicking the icon replaces the rendered content with an EasyMDE markdown editor. Save and Cancel buttons below the editor control state transitions.

## Architecture

**Single component**: `app/web/src/components/content/EditableContent.vue` using `<script setup lang="ts">`.

This follows the project pattern where components are self-contained single-file components. No composable extraction — the component is focused enough to keep all logic in one file (~150-200 lines).

## Interface

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `uuid` | `string` | Yes | Identifies the content block; hard-coded by the parent |
| `content` | `string` | undefined | Optional markdown string to render |

### External Dependencies

- `useEditingMode` composable — provides `isEditingMode` readonly ref; not a prop

### Internal State

| Variable | Type | Purpose |
|----------|------|---------|
| `isEditing` | `ref<boolean>` | Whether the EasyMDE editor is active |
| `localContent` | `ref<string>` | Working copy of content for the editor |
| `editorContainer` | `ref<HTMLElement \| null>` | Template ref for EasyMDE mount point |
| `easyMDEInstance` | `EasyMDE \| null` | Handle to the editor instance for cleanup |

## Behavior

### State Table

| Condition | Rendering |
|-----------|-----------|
| `!isEditingMode` | `MarkdownRenderer` only — no border, no hover |
| `isEditingMode && !isEditing` | `MarkdownRenderer` with gold dashed border, hover shows `fa-pen` icon |
| `isEditingMode && isEditing` | EasyMDE editor + Save/Cancel buttons inline |

### Edit Flow

1. **Hover**: When `isEditingMode` is true and `!isEditing`, hovering over the component reveals a `fa-pen` icon positioned top-right inside the border via `group-hover`.
2. **Click edit icon**: Set `localContent = props.content ?? ''`, set `isEditing = true`.
3. **Next tick**: Create EasyMDE instance on `editorContainer` with the minimal toolbar config.
4. **Cancel**: Destroy EasyMDE instance, reset `localContent`, set `isEditing = false`.
5. **Save**: `console.log({ uuid, content: easyMDEInstance.value() })` — placeholder for future POST request. Destroy EasyMDE instance, set `isEditing = false`.

### Cleanup

`onUnmounted` destroys the EasyMDE instance if still active.

## Styling

### Edit Mode Border

```
border-2 border-dashed border-vsg-gold-500 rounded-lg
```

Applied conditionally when `isEditingMode` is true. Padding ensures content doesn't sit against the border.

### Hover Edit Icon

`fa-pen` icon in `vsg-gold-500`, positioniert oben-rechts innerhalb des Rahmens. Hidden per Default, sichtbar bei `group-hover`. Container hat `group` class, Icon hat `opacity-0 group-hover:opacity-100 transition-opacity`.

### Editor Area

Uses existing EasyMDE theme styles already present in `style.css` (lines 363-465). No additional custom CSS needed.

### Action Buttons

- **Save**: Uses existing `btn-primary` utility class
- **Cancel**: Neutral button style (secondary: `bg-gray-700 hover:bg-gray-600 text-white`)

## EasyMDE Configuration

```ts
new EasyMDE({
  element: editorContainer.value!,
  initialValue: localContent.value,
  spellChecker: false,
  toolbar: ['bold', 'italic', 'heading', 'link', 'unordered-list', 'quote'],
  status: false,
})
```

### New Dependencies

- `easymde` — npm package
- `@types/easymde` — TypeScript declarations
- EasyMDE CSS import needed in the component or `main.ts`

### Existing Dependencies Used

- `MarkdownRenderer.vue` — for display mode rendering
- `useEditingMode` composable — for `isEditingMode` state
- `faPen` icon — already registered in `main.ts`

## Template Structure (Pseudocode)

```html
<div v-if="!isEditingMode">
  <MarkdownRenderer :content="content" />
</div>

<div v-else :class="editingModeClasses" class="group relative">
  <!-- Display mode -->
  <div v-if="!isEditing">
    <MarkdownRenderer :content="content" />
    <button @click="startEditing" class="edit-icon">
      <FontAwesomeIcon :icon="faPen" />
    </button>
  </div>

  <!-- Edit mode -->
  <div v-else>
    <div ref="editorContainer"></div>
    <div class="flex gap-2 justify-end mt-2">
      <button @click="cancelEditing" class="btn-secondary">Abbrechen</button>
      <button @click="saveContent" class="btn-primary">Speichern</button>
    </div>
  </div>
</div>
```

## Out of Scope

- POST request implementation (placeholder `console.log` for now)
- Optimistic updates or state sync with server
- Image upload in EasyMDE
- Auto-save / draft persistence
- Content versioning or history
- Multiple editable content blocks coordination