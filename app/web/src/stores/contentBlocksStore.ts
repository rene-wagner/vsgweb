import { defineStore } from "pinia";
import { ref } from "vue";
import type { ContentBlock, SaveContentBlockInput } from "@vsg/sdk";
import { getApiErrorMessage, vsg } from "@/lib/sdk";

function getContentBlockKey(url: string, id: string): string {
  return `${url}::${id}`;
}

function normalizeContentBlocks(blocks: ContentBlock[]): Record<string, ContentBlock> {
  return Object.fromEntries(blocks.map((block) => [block.id, block]));
}

export const useContentBlocksStore = defineStore("contentBlocks", () => {
  const blocksByUrl = ref<Record<string, Record<string, ContentBlock>>>({});
  const loadedUrls = ref<Record<string, boolean>>({});
  const loadingUrls = ref<Record<string, boolean>>({});
  const urlErrors = ref<Record<string, string | null>>({});
  const savingKeys = ref<Record<string, boolean>>({});
  const saveErrors = ref<Record<string, string | null>>({});
  const csrfToken = ref<string | null>(null);

  const inflightLoads = new Map<string, Promise<void>>();
  let inflightCsrfTokenRequest: Promise<string> | null = null;

  async function getCsrfToken(): Promise<string> {
    if (csrfToken.value) {
      return csrfToken.value;
    }

    if (inflightCsrfTokenRequest) {
      return inflightCsrfTokenRequest;
    }

    inflightCsrfTokenRequest = (async () => {
      try {
        const response = await vsg.contentBlocks.getCsrfToken({ credentials: "include" });
        csrfToken.value = response.token;
        return response.token;
      } finally {
        inflightCsrfTokenRequest = null;
      }
    })();

    return inflightCsrfTokenRequest;
  }

  async function fetchContentBlocksForUrl(url: string): Promise<void> {
    if (loadedUrls.value[url]) {
      return;
    }

    const inflightLoad = inflightLoads.get(url);

    if (inflightLoad) {
      return inflightLoad;
    }

    const loadPromise = (async () => {
      loadingUrls.value[url] = true;
      urlErrors.value[url] = null;

      try {
        const result = await vsg.contentBlocks.list({ query: { url } });
        blocksByUrl.value[url] = normalizeContentBlocks(result.member ?? []);
        loadedUrls.value[url] = true;
      } catch (error) {
        urlErrors.value[url] = getApiErrorMessage(error);
        throw error;
      } finally {
        loadingUrls.value[url] = false;
        inflightLoads.delete(url);
      }
    })();

    inflightLoads.set(url, loadPromise);
    return loadPromise;
  }

  function getContent(url: string, id: string): string | undefined {
    return blocksByUrl.value[url]?.[id]?.content;
  }

  function hasLoadedUrl(url: string): boolean {
    return loadedUrls.value[url] ?? false;
  }

  function isLoadingUrl(url: string): boolean {
    return loadingUrls.value[url] ?? false;
  }

  function getUrlError(url: string): string | null {
    return urlErrors.value[url] ?? null;
  }

  function isSavingContentBlock(url: string, id: string): boolean {
    return savingKeys.value[getContentBlockKey(url, id)] ?? false;
  }

  function getSaveError(url: string, id: string): string | null {
    return saveErrors.value[getContentBlockKey(url, id)] ?? null;
  }

  async function saveContentBlock(input: SaveContentBlockInput): Promise<void> {
    const saveKey = getContentBlockKey(input.url, input.id);
    savingKeys.value[saveKey] = true;
    saveErrors.value[saveKey] = null;

    try {
      const token = await getCsrfToken();
      const savedContentBlock = await vsg.contentBlocks.save(input, {
        credentials: "include",
        headers: {
          "X-CSRF-Token": token,
        },
      });

      blocksByUrl.value[input.url] = {
        ...blocksByUrl.value[input.url],
        [savedContentBlock.id]: savedContentBlock,
      };
      loadedUrls.value[input.url] = true;
    } catch (error) {
      saveErrors.value[saveKey] = getApiErrorMessage(error);
      throw error;
    } finally {
      savingKeys.value[saveKey] = false;
    }
  }

  return {
    fetchContentBlocksForUrl,
    getContent,
    hasLoadedUrl,
    isLoadingUrl,
    getUrlError,
    isSavingContentBlock,
    getSaveError,
    saveContentBlock,
  };
});
