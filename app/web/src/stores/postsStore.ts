import { ref } from "vue";
import { defineStore } from "pinia";
import { VsgApiError } from "@vsg/sdk";
import type { Post } from "@vsg/types";
import { getApiErrorMessage, vsg } from "@/lib/sdk";
import { normalizePost } from "@/services/posts/post-normalizer.service";

export const usePostsStore = defineStore("posts", () => {
  // List state
  const posts = ref<Post[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Department posts state (filtered by category)
  const departmentPosts = ref<Post[]>([]);
  const isDepartmentPostsLoading = ref(false);
  const departmentPostsError = ref<string | null>(null);

  // Single post state
  const currentPost = ref<Post | null>(null);
  const currentPostLoading = ref(false);
  const currentPostError = ref<string | null>(null);
  const currentPostNotFound = ref(false);

  async function fetchPublishedPosts(itemsPerPage = 5): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      const result = await vsg.posts.list({ query: { published: true, itemsPerPage } });
      posts.value = (result.member ?? []).map(normalizePost);
    } catch (e) {
      error.value = getApiErrorMessage(e);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchPublishedPostsByCategory(categorySlug: string, itemsPerPage = 5): Promise<void> {
    isDepartmentPostsLoading.value = true;
    departmentPostsError.value = null;

    try {
      const result = await vsg.posts.list({
        query: { published: true, category: categorySlug, itemsPerPage },
      });
      departmentPosts.value = (result.member ?? []).map(normalizePost);
    } catch (e) {
      departmentPostsError.value = getApiErrorMessage(e);
      throw e;
    } finally {
      isDepartmentPostsLoading.value = false;
    }
  }

  function clearDepartmentPosts(): void {
    departmentPosts.value = [];
    isDepartmentPostsLoading.value = false;
    departmentPostsError.value = null;
  }

  async function fetchPostBySlug(slug: string): Promise<void> {
    currentPostLoading.value = true;
    currentPostError.value = null;
    currentPostNotFound.value = false;
    currentPost.value = null;

    try {
      const post = await vsg.posts.get(slug);
      currentPost.value = normalizePost(post);
    } catch (e) {
      if (e instanceof VsgApiError && e.status === 404) {
        currentPostNotFound.value = true;
      } else {
        currentPostError.value = getApiErrorMessage(e);
      }
    } finally {
      currentPostLoading.value = false;
    }
  }

  function clearCurrentPost(): void {
    currentPost.value = null;
    currentPostError.value = null;
    currentPostNotFound.value = false;
  }

  return {
    posts,
    isLoading,
    error,
    fetchPublishedPosts,
    departmentPosts,
    isDepartmentPostsLoading,
    departmentPostsError,
    fetchPublishedPostsByCategory,
    clearDepartmentPosts,
    currentPost,
    currentPostLoading,
    currentPostError,
    currentPostNotFound,
    fetchPostBySlug,
    clearCurrentPost,
  };
});
