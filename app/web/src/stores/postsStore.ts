import { ref } from "vue";
import { defineStore } from "pinia";
import { VsgApiError, type ApiCollection, type Post as ApiPost } from "@vsg/sdk";
import { getApiErrorMessage, vsg } from "@/lib/sdk";

export interface Author {
  id: number;
  username: string;
  email: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Thumbnail {
  filename: string;
  originalName: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string | null;
  published: boolean;
  authorId: number;
  author: Author;
  categories: Category[];
  tags: Tag[];
  thumbnail: Thumbnail | null;
  createdAt: string;
  updatedAt: string;
}

function normalizePost(post: ApiPost): Post {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content ?? null,
    published: post.published ?? false,
    authorId: post.author?.id ?? 0,
    author: {
      id: post.author?.id ?? 0,
      username: [post.author?.firstName, post.author?.lastName].filter(Boolean).join(" "),
      email: post.author?.email ?? "",
    },
    categories: (post.categories ?? []).map((category, index) => ({
      id: index,
      name: category.name,
      slug: category.slug,
    })),
    tags: [],
    thumbnail: null,
    createdAt: post.createdAt ?? "",
    updatedAt: post.updatedAt ?? "",
  };
}

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

  async function fetchPublishedPosts(limit = 5): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      const result = await vsg.get<ApiCollection<ApiPost>>(`/api/posts?published=true&limit=${limit}`);
      posts.value = (result.member ?? []).map(normalizePost);
    } catch (e) {
      posts.value = [];
      error.value = getApiErrorMessage(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchPublishedPostsByCategory(categorySlug: string, limit = 5): Promise<void> {
    isDepartmentPostsLoading.value = true;
    departmentPostsError.value = null;

    try {
      const result = await vsg.get<ApiCollection<ApiPost>>(
        `/api/posts?published=true&category=${encodeURIComponent(categorySlug)}&limit=${limit}`,
      );
      departmentPosts.value = (result.member ?? []).map(normalizePost);
    } catch (e) {
      departmentPosts.value = [];
      departmentPostsError.value = getApiErrorMessage(e);
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
      const post = await vsg.get<ApiPost>(`/api/posts/${encodeURIComponent(slug)}`);
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
    currentPostLoading.value = false;
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
