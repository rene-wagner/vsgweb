import { ref } from "vue";
import { defineStore } from "pinia";
import type { BoardContent } from "../types/board-content.types";
import { getApiErrorMessage, vsg } from "@/lib/sdk";

export const useBoardStore = defineStore("board", () => {
  const boardContent = ref<BoardContent | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchBoardContent(): Promise<BoardContent | null> {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await vsg.get<BoardContent>("/api/board-content");
      boardContent.value = data;
      return data;
    } catch (e) {
      error.value = getApiErrorMessage(e);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    boardContent,
    isLoading,
    error,
    fetchBoardContent,
  };
});
