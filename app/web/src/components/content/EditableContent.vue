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