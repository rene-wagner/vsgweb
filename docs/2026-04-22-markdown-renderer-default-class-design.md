# MarkdownRenderer Default Class Design

## Goal

Extend `app/web/src/components/ui/MarkdownRenderer.vue` with a new prop that controls whether the root element receives the `.markdown-content` CSS class.

## Requirements

- Add a new optional prop named `useDefaultClass`
- Default value is `true`
- When `useDefaultClass` is `true`, the root rendered element keeps the `.markdown-content` class
- When `useDefaultClass` is `false`, the rendered element should not receive the `.markdown-content` class
- Existing usages must keep their current behavior without modification

## Design

`MarkdownRenderer.vue` will keep its current rendering logic for `content` and `renderedHtml`.

The change is limited to the component props definition and the template class binding:

- Extend the props interface with `useDefaultClass?: boolean`
- Use `withDefaults(defineProps<Props>(), { useDefaultClass: true })`
- Replace the fixed `class="markdown-content"` on the root `<div>` with a conditional binding:

```vue
:class="{ 'markdown-content': props.useDefaultClass }"
```

## Compatibility

This is backward-compatible for all existing call sites because the new prop defaults to `true`.

Current known usages in:

- `app/web/src/views/PostView.vue`
- `app/web/src/components/content/EditableContent.vue`

do not need any changes.

## Styling Behavior

The component's scoped CSS remains attached to `.markdown-content` selectors.

That means:

- `useDefaultClass = true`: existing typography and markdown styling applies
- `useDefaultClass = false`: the rendered HTML is still output, but the component's default markdown wrapper styles do not apply

This is intentional and is the main purpose of the new prop.

## Verification

- Run `npm run lint --workspace web`
- Confirm existing usages still type-check without modification
- Optionally verify a call site can pass `:use-default-class="false"` without errors
