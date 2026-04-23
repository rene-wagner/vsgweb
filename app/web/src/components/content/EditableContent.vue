<script setup lang="ts">
import { nextTick, onUnmounted, ref, watch } from "vue";
import EasyMDE from "easymde";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer.vue";
import { useEditingMode } from "@/composables/useEditingMode";
import { faPen } from "@fortawesome/free-solid-svg-icons";

interface Props {
  uuid: string;
  content?: string;
  tag?: string;
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
});

const { isEditingMode } = useEditingMode();

const isEditing = ref(false);
const isStarting = ref(false);
const localContent = ref("");
const editorContainer = ref<HTMLTextAreaElement | null>(null);
let easyMDEInstance: EasyMDE | null = null;

async function startEditing() {
  if (isStarting.value || isEditing.value) return;
  isStarting.value = true;
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

watch(isEditingMode, (newVal) => {
  if (!newVal && isEditing.value) cancelEditing();
});
</script>

<template>
  <MarkdownRenderer
    v-if="!isEditingMode"
    :content="content"
    :tag="tag"
    :use-default-class="false"
  />

  <div v-else class="group relative border-2 border-dashed border-vsg-gold-500 p-3">
    <template v-if="!isEditing">
      <MarkdownRenderer :content="content" :tag="tag" :use-default-class="false" />
      <button
        type="button"
        class="absolute top-2 right-2 text-base leading-none text-vsg-gold-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        aria-label="Bearbeiten"
        :disabled="isStarting"
        @click="startEditing"
      >
        <FontAwesomeIcon :icon="faPen" class="text-base" />
      </button>
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
          @click="saveContent"
        >
          Speichern
        </button>
      </div>
    </div>
  </div>
</template>
