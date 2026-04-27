<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import EasyMDE from "easymde";
import MarkdownRenderer from "@/components/content/MarkdownRenderer.vue";
import { useEditingMode } from "@/composables/useEditingMode";
import { useContentBlocksStore } from "@/stores/contentBlocksStore";
import { faPen } from "@fortawesome/free-solid-svg-icons";

interface Props {
  uuid: string;
  content?: string;
  tag?: string;
  contentClass?: string;
  frameClass?: string;
  editButtonClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  frameClass: "border-vsg-gold-500",
  editButtonClass: "text-vsg-gold-500",
});

const { isEditingMode } = useEditingMode();
const route = useRoute();
const contentBlocksStore = useContentBlocksStore();

const isEditing = ref(false);
const isStarting = ref(false);
const localContent = ref("");
const editorContainer = ref<HTMLTextAreaElement | null>(null);
let easyMDEInstance: EasyMDE | null = null;

const currentUrl = computed(() => route.path || "/");
const storedContent = computed(() => contentBlocksStore.getContent(currentUrl.value, props.uuid));
const resolvedContent = computed(() => {
  if (contentBlocksStore.hasLoadedUrl(currentUrl.value)) {
    return storedContent.value ?? "";
  }

  return props.content ?? "";
});
const isLoadingContent = computed(() => contentBlocksStore.isLoadingUrl(currentUrl.value));
const loadError = computed(() => contentBlocksStore.getUrlError(currentUrl.value));
const isSavingContent = computed(() =>
  contentBlocksStore.isSavingContentBlock(currentUrl.value, props.uuid),
);
const saveError = computed(() => contentBlocksStore.getSaveError(currentUrl.value, props.uuid));

async function loadContent(): Promise<void> {
  try {
    await contentBlocksStore.fetchContentBlocksForUrl(currentUrl.value);
  } catch {
    // Fall back to the provided content until the backend is populated or reachable.
  }
}

async function startEditing() {
  if (isStarting.value || isEditing.value) return;
  isStarting.value = true;
  localContent.value = resolvedContent.value;
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
  isStarting.value = false;
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

async function saveContent() {
  if (!easyMDEInstance) {
    return;
  }

  const content = easyMDEInstance.value();

  try {
    await contentBlocksStore.saveContentBlock({
      id: props.uuid,
      url: currentUrl.value,
      content,
    });
  } catch {
    return;
  }

  destroyEditor();
  localContent.value = content;
  isEditing.value = false;
}

onUnmounted(() => {
  destroyEditor();
});

watch(isEditingMode, (newVal) => {
  if (!newVal && isEditing.value) cancelEditing();
});

watch(
  () => currentUrl.value,
  () => {
    if (isEditing.value) {
      cancelEditing();
    }

    void loadContent();
  },
  { immediate: true },
);
</script>

<template>
  <MarkdownRenderer
    v-if="!isEditingMode"
    :content="resolvedContent"
    :tag="tag"
    :content-class="contentClass"
    :use-default-class="false"
  />

  <div v-else class="group relative border-2 border-dashed p-3" :class="frameClass">
    <template v-if="!isEditing">
      <MarkdownRenderer
        :content="resolvedContent"
        :tag="tag"
        :content-class="contentClass"
        :use-default-class="false"
      />
      <button
        type="button"
        class="absolute top-2 right-2 text-base leading-none opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        :class="editButtonClass"
        aria-label="Bearbeiten"
        :disabled="isStarting || isLoadingContent"
        @click="startEditing"
      >
        <FontAwesomeIcon :icon="faPen" class="text-base" />
      </button>
      <p v-if="loadError" class="mt-2 text-sm font-normal text-red-400">{{ loadError }}</p>
    </template>

    <div v-else class="text-left text-base font-normal leading-normal normal-case tracking-normal">
      <textarea ref="editorContainer"></textarea>
      <div class="mt-2 flex justify-end gap-2">
        <button
          type="button"
          class="bg-red-600 px-4 py-2 text-base font-normal text-white transition-colors hover:bg-red-500"
          @click="cancelEditing"
        >
          Abbrechen
        </button>
        <button
          type="button"
          class="bg-green-600 px-4 py-2 text-base font-normal text-white transition-colors hover:bg-green-500"
          :disabled="isSavingContent"
          @click="saveContent"
        >
          {{ isSavingContent ? "Speichert..." : "Speichern" }}
        </button>
      </div>
      <p v-if="saveError" class="mt-2 text-sm text-red-400">{{ saveError }}</p>
    </div>
  </div>
</template>
